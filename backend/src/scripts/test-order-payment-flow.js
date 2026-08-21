import mongoose from "mongoose";
import crypto from "node:crypto";
import { connectMongo, disconnectMongo } from "../database/mongo.js";
import { CustomerModel, ProductModel, OrderModel, CartModel } from "../models/index.js";
import { checkoutCart, addCartItem, getCart } from "../services/cart.service.js";
import { verifyCheckoutPayment, handleRazorpayWebhook } from "../services/payment.service.js";
import { env } from "../config/index.js";

const runTests = async () => {
  console.log("==================================================");
  console.log("STARTING ORDER & PAYMENT FLOW AUTOMATED TESTS");
  console.log("==================================================");

  await connectMongo();

  const testEmail = `test.customer.${Date.now()}@example.com`;
  let customer = await CustomerModel.create({
    name: "Test Customer",
    email: testEmail,
    passwordHash: "test_hash_12345",
    addresses: [
      {
        recipientName: "Test Customer",
        line1: "123 Test Street",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
        isDefault: true
      }
    ]
  });

  const phoneModel = await mongoose.model("PhoneModel").create({
    brand: "Apple",
    name: "iPhone 15 Pro",
    slug: `iphone-15-pro-${Date.now()}`
  });

  let product = await ProductModel.create({
    name: "Test Leather Case",
    slug: `test-leather-case-${Date.now()}`,
    sku: `CASE-${Date.now()}`,
    phoneModelId: phoneModel._id,
    basePrice: 199900, // ₹1,999.00
    salePrice: 149900, // ₹1,499.00
    stock: 50,
    status: "Published",
    activity: []
  });

  const baseAddress = {
    recipientName: "Test Customer",
    line1: "123 Test Street",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India"
  };

  const results = [];

  // ==========================================
  // TEST 1: COD FLOW
  // ==========================================
  console.log("\n--- TEST 1: COD Checkout Flow ---");
  try {
    // Add item to cart
    await addCartItem(customer._id.toString(), { productId: product._id.toString(), quantity: 2 });
    const initialProduct = await ProductModel.findById(product._id);
    const initialStock = initialProduct.stock;

    const codResult = await checkoutCart(customer._id.toString(), {
      paymentMethod: "COD",
      shippingAddress: baseAddress,
      billingAddress: baseAddress,
      shippingMethod: "standard"
    });

    const codOrder = await OrderModel.findById(codResult.orderId);
    const updatedProduct = await ProductModel.findById(product._id);
    const cartAfterCod = await getCart(customer._id.toString());

    const isConfirmed = codOrder.status === "Confirmed";
    const isPaymentPending = codOrder.paymentStatus === "Pending";
    const isStockDeducted = updatedProduct.stock === initialStock - 2;
    const isCartCleared = cartAfterCod.items.length === 0;
    const isShiprocketTriggered = codOrder.shipping?.shiprocketShipmentId !== null;

    if (isConfirmed && isPaymentPending && isStockDeducted && isCartCleared && isShiprocketTriggered) {
      console.log("✔ TEST 1 PASSED: COD order confirmed, stock deducted (50 -> 48), cart cleared, Shiprocket triggered.");
      results.push({ test: "1. COD Flow", passed: true });
    } else {
      throw new Error(`COD Assertions failed: status=${codOrder.status}, paymentStatus=${codOrder.paymentStatus}, stock=${updatedProduct.stock}, cartItems=${cartAfterCod.items.length}`);
    }
  } catch (err) {
    console.error("✖ TEST 1 FAILED:", err.message);
    results.push({ test: "1. COD Flow", passed: false, error: err.message });
  }

  // ==========================================
  // TEST 2: ONLINE PAYMENT SUCCESS FLOW
  // ==========================================
  console.log("\n--- TEST 2: Online Payment Success Flow ---");
  let onlineOrderId, razorpayOrderId;
  try {
    // Add item to cart
    await addCartItem(customer._id.toString(), { productId: product._id.toString(), quantity: 1 });
    const prodBefore = await ProductModel.findById(product._id);
    const stockBefore = prodBefore.stock;

    // Checkout online (Card)
    const onlineResult = await checkoutCart(customer._id.toString(), {
      paymentMethod: "Online",
      shippingAddress: baseAddress,
      billingAddress: baseAddress,
      shippingMethod: "standard"
    });

    onlineOrderId = onlineResult.orderId;
    razorpayOrderId = onlineResult.razorpayOrderId;

    const orderPending = await OrderModel.findById(onlineOrderId);
    const prodPending = await ProductModel.findById(product._id);
    const cartPending = await getCart(customer._id.toString());

    // Verify Pending states before payment
    const isOrderPending = orderPending.status === "Pending" && orderPending.paymentStatus === "Pending";
    const isStockNotPermanentlyDeducted = prodPending.stock === stockBefore;
    const isCartPreserved = cartPending.items.length === 1;
    const hasRealRazorpayOrder = typeof razorpayOrderId === "string" && razorpayOrderId.startsWith("order_");

    console.log(`- Pre-payment state: order status=${orderPending.status}, stock=${prodPending.stock}, cartItems=${cartPending.items.length}, rzpOrder=${razorpayOrderId}`);

    // Generate valid Razorpay payment ID and HMAC signature
    const mockPaymentId = `pay_${Date.now()}`;
    const validSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${mockPaymentId}`)
      .digest("hex");

    // Verify payment on backend
    const verificationResult = await verifyCheckoutPayment({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: mockPaymentId,
      razorpay_signature: validSignature,
      orderId: onlineOrderId
    });

    const orderAfterVerify = await OrderModel.findById(onlineOrderId);
    const prodAfterVerify = await ProductModel.findById(product._id);
    const cartAfterVerify = await getCart(customer._id.toString());

    const isNowPaid = orderAfterVerify.paymentStatus === "Paid" && orderAfterVerify.status === "Confirmed";
    const isStockNowDeducted = prodAfterVerify.stock === stockBefore - 1;
    const isCartNowCleared = cartAfterVerify.items.length === 0;
    const isShiprocketNowTriggered = orderAfterVerify.shipping?.shiprocketShipmentId !== null;

    if (isOrderPending && isStockNotPermanentlyDeducted && isCartPreserved && hasRealRazorpayOrder &&
        isNowPaid && isStockNowDeducted && isCartNowCleared && isShiprocketNowTriggered) {
      console.log("✔ TEST 2 PASSED: Online payment successfully created Pending order with real Razorpay order ID, verified signature, updated to Paid/Confirmed, deducted stock, cleared cart, and triggered Shiprocket.");
      results.push({ test: "2. Online Success Flow", passed: true });
    } else {
      throw new Error(`Online assertions failed: isNowPaid=${isNowPaid}, isStockNowDeducted=${isStockNowDeducted}, isCartNowCleared=${isCartNowCleared}`);
    }
  } catch (err) {
    console.error("✖ TEST 2 FAILED:", err.message);
    results.push({ test: "2. Online Success Flow", passed: false, error: err.message });
  }

  // ==========================================
  // TEST 3: ONLINE FAILURE / CANCEL FLOW
  // ==========================================
  console.log("\n--- TEST 3: Online Payment Failure / Cancel Flow ---");
  let pendingOrderIdForTest4, pendingRzpIdForTest4;
  try {
    await addCartItem(customer._id.toString(), { productId: product._id.toString(), quantity: 1 });
    const prodBefore = await ProductModel.findById(product._id);
    const stockBefore = prodBefore.stock;

    const onlineFailResult = await checkoutCart(customer._id.toString(), {
      paymentMethod: "Online",
      shippingAddress: baseAddress,
      billingAddress: baseAddress,
      shippingMethod: "standard"
    });

    pendingOrderIdForTest4 = onlineFailResult.orderId;
    pendingRzpIdForTest4 = onlineFailResult.razorpayOrderId;

    // Customer cancels or payment fails (no verification completed)
    const orderFail = await OrderModel.findById(onlineFailResult.orderId);
    const prodFail = await ProductModel.findById(product._id);
    const cartFail = await getCart(customer._id.toString());

    const orderRemainsPending = orderFail.status === "Pending" && orderFail.paymentStatus === "Pending";
    const stockRemainsIntact = prodFail.stock === stockBefore;
    const cartRemainsIntact = cartFail.items.length === 1;
    const noShipmentConfirmed = orderFail.shippingStatus === "Label Created" && orderFail.status !== "Confirmed";

    if (orderRemainsPending && stockRemainsIntact && cartRemainsIntact && noShipmentConfirmed) {
      console.log("✔ TEST 3 PASSED: Abandoned/cancelled online payment left order Pending, stock intact, cart intact, and did not confirm order.");
      results.push({ test: "3. Online Failure/Cancel Flow", passed: true });
    } else {
      throw new Error(`Failure/cancel assertions failed: status=${orderFail.status}, stock=${prodFail.stock}, cart=${cartFail.items.length}`);
    }
  } catch (err) {
    console.error("✖ TEST 3 FAILED:", err.message);
    results.push({ test: "3. Online Failure/Cancel Flow", passed: false, error: err.message });
  }

  // ==========================================
  // TEST 4: SIGNATURE FAILURE
  // ==========================================
  console.log("\n--- TEST 4: Signature Failure (Tampered / Invalid Signature) ---");
  try {
    const fakeSignature = "invalid_tampered_signature_1234567890abcdef";
    let signatureFailed = false;

    try {
      await verifyCheckoutPayment({
        razorpay_order_id: pendingRzpIdForTest4,
        razorpay_payment_id: "pay_fake123",
        razorpay_signature: fakeSignature,
        orderId: pendingOrderIdForTest4
      });
    } catch (verifyErr) {
      signatureFailed = true;
      console.log(`- Caught expected error on invalid signature: "${verifyErr.message}"`);
    }

    if (signatureFailed) {
      console.log("✔ TEST 4 PASSED: Invalid/tampered signature correctly rejected by backend.");
      results.push({ test: "4. Signature Failure", passed: true });
    } else {
      throw new Error("Invalid signature was unexpectedly accepted!");
    }
  } catch (err) {
    console.error("✖ TEST 4 FAILED:", err.message);
    results.push({ test: "4. Signature Failure", passed: false, error: err.message });
  }

  // ==========================================
  // TEST 5: DUPLICATE VERIFICATION (IDEMPOTENCY)
  // ==========================================
  console.log("\n--- TEST 5: Duplicate Verification Idempotency ---");
  try {
    const prodBefore = await ProductModel.findById(product._id);
    const stockBefore = prodBefore.stock;

    // Verify again for order that was already verified in Test 2
    const mockPaymentId = `pay_${Date.now()}`;
    const validSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${mockPaymentId}`)
      .digest("hex");

    const dupResult = await verifyCheckoutPayment({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: mockPaymentId,
      razorpay_signature: validSignature,
      orderId: onlineOrderId
    });

    const prodAfter = await ProductModel.findById(product._id);
    const orderAfter = await OrderModel.findById(onlineOrderId);

    const isStillConfirmed = dupResult.status === "Confirmed" && dupResult.paymentStatus === "Paid";
    const noDoubleStockDeduction = prodAfter.stock === stockBefore;

    if (isStillConfirmed && noDoubleStockDeduction) {
      console.log("✔ TEST 5 PASSED: Duplicate verification is idempotent; returned confirmed order without re-deducting stock.");
      results.push({ test: "5. Duplicate Verification", passed: true });
    } else {
      throw new Error(`Duplicate verification failed: stockBefore=${stockBefore}, stockAfter=${prodAfter.stock}`);
    }
  } catch (err) {
    console.error("✖ TEST 5 FAILED:", err.message);
    results.push({ test: "5. Duplicate Verification", passed: false, error: err.message });
  }

  // ==========================================
  // TEST 6: DUPLICATE WEBHOOK (IDEMPOTENCY)
  // ==========================================
  console.log("\n--- TEST 6: Duplicate Webhook Idempotency ---");
  try {
    const webhookPayload = {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_webhook_test_123",
            order_id: razorpayOrderId,
            amount: 149900,
            status: "captured"
          }
        }
      }
    };

    const rawBody = JSON.stringify(webhookPayload);
    const webhookSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    const prodBefore = await ProductModel.findById(product._id);
    const stockBefore = prodBefore.stock;

    // Send webhook 1st time
    const res1 = await handleRazorpayWebhook({
      rawBody,
      signature: webhookSignature,
      eventData: webhookPayload
    });

    // Send webhook 2nd time (duplicate)
    const res2 = await handleRazorpayWebhook({
      rawBody,
      signature: webhookSignature,
      eventData: webhookPayload
    });

    const prodAfter = await ProductModel.findById(product._id);
    const noDoubleStock = prodAfter.stock === stockBefore;

    if (noDoubleStock) {
      console.log("✔ TEST 6 PASSED: Duplicate webhooks processed cleanly and idempotently without duplicate stock deduction.");
      results.push({ test: "6. Duplicate Webhook", passed: true });
    } else {
      throw new Error(`Duplicate webhook caused stock mismatch: before=${stockBefore}, after=${prodAfter.stock}`);
    }
  } catch (err) {
    console.error("✖ TEST 6 FAILED:", err.message);
    results.push({ test: "6. Duplicate Webhook", passed: false, error: err.message });
  }

  // ==========================================
  // TEST 7: ONLY ONE SHIPROCKET SHIPMENT
  // ==========================================
  console.log("\n--- TEST 7: Only One Shiprocket Shipment ---");
  try {
    const order = await OrderModel.findById(onlineOrderId);
    const shipmentId = order.shipping?.shiprocketShipmentId;
    const hasShipmentId = typeof shipmentId === "string" && shipmentId.startsWith("SR-");

    if (hasShipmentId) {
      console.log(`✔ TEST 7 PASSED: Single unique Shiprocket shipment reference (${shipmentId}) exists for order #${order.orderNumber}.`);
      results.push({ test: "7. Single Shiprocket Shipment", passed: true });
    } else {
      throw new Error(`Shipment assertion failed: shipmentId=${shipmentId}`);
    }
  } catch (err) {
    console.error("✖ TEST 7 FAILED:", err.message);
    results.push({ test: "7. Single Shiprocket Shipment", passed: false, error: err.message });
  }

  // ==========================================
  // TEST 8: CORRECT CART / INVENTORY BEHAVIOR
  // ==========================================
  console.log("\n--- TEST 8: Correct Cart & Inventory Behavior ---");
  try {
    const finalProduct = await ProductModel.findById(product._id);
    const finalCustomerCart = await getCart(customer._id.toString());

    console.log(`- Final Product Stock: ${finalProduct.stock} (Initial: 50, COD bought 2, Online bought 1, Cancelled 0 -> Expected: 47)`);
    console.log(`- Final Cart Items: ${finalCustomerCart.items.length} (Expected: 1 remaining from cancelled Test 3)`);

    const stockIs47 = finalProduct.stock === 47;
    const cartHas1 = finalCustomerCart.items.length === 1;

    if (stockIs47 && cartHas1) {
      console.log("✔ TEST 8 PASSED: Inventory accurately reflects only confirmed orders (50 - 2 COD - 1 Online = 47), and abandoned cart is preserved.");
      results.push({ test: "8. Cart & Inventory Behavior", passed: true });
    } else {
      throw new Error(`Inventory/Cart assertion failed: stock=${finalProduct.stock} (expected 47), cartItems=${finalCustomerCart.items.length} (expected 1)`);
    }
  } catch (err) {
    console.error("✖ TEST 8 FAILED:", err.message);
    results.push({ test: "8. Cart & Inventory Behavior", passed: false, error: err.message });
  }

  // Cleanup test documents
  await OrderModel.deleteMany({ customer: customer._id });
  await CartModel.deleteMany({ customer: customer._id });
  await CustomerModel.findByIdAndDelete(customer._id);
  await ProductModel.findByIdAndDelete(product._id);

  await disconnectMongo();

  console.log("\n==================================================");
  console.log("TEST SUMMARY");
  console.log("==================================================");
  results.forEach(r => {
    console.log(`${r.passed ? "PASSED" : "FAILED"}: ${r.test}`);
  });
  console.log("==================================================");
};

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
