import {
  VALID_ORDER_TRANSITIONS,
  VALID_PAYMENT_TRANSITIONS,
  VALID_SHIPPING_TRANSITIONS,
  VALID_RETURN_TRANSITIONS
} from "../constants/index.js";

/**
 * Validates if a transition from currentStatus to newStatus is valid
 * @param {string} currentStatus - The current status
 * @param {string} newStatus - The proposed new status
 * @param {string} transitionType - Type of transition: 'order', 'payment', 'shipping', 'return'
 * @returns {boolean} - True if valid transition
 */
export function isValidTransition(currentStatus, newStatus, transitionType = "order") {
  if (currentStatus === newStatus) {
    return true; // Same status is always valid (no-op)
  }

  let transitions;
  switch (transitionType) {
    case "order":
      transitions = VALID_ORDER_TRANSITIONS;
      break;
    case "payment":
      transitions = VALID_PAYMENT_TRANSITIONS;
      break;
    case "shipping":
      transitions = VALID_SHIPPING_TRANSITIONS;
      break;
    case "return":
      transitions = VALID_RETURN_TRANSITIONS;
      break;
    default:
      transitions = VALID_ORDER_TRANSITIONS;
  }

  const allowedNextStatuses = transitions[currentStatus];
  if (!allowedNextStatuses) {
    return false; // Current status not found in transitions map
  }

  return allowedNextStatuses.includes(newStatus);
}

/**
 * Throws an error if the transition is invalid
 * @param {string} currentStatus - The current status
 * @param {string} newStatus - The proposed new status
 * @param {string} transitionType - Type of transition: 'order', 'payment', 'shipping', 'return'
 * @param {string} entityName - Name of entity for error message (e.g., 'Order', 'Payment')
 * @throws {Error} - BusinessRuleError if invalid
 */
export function validateTransition(currentStatus, newStatus, transitionType = "order", entityName = "Order") {
  if (!isValidTransition(currentStatus, newStatus, transitionType)) {
    const transitions = {
      order: VALID_ORDER_TRANSITIONS,
      payment: VALID_PAYMENT_TRANSITIONS,
      shipping: VALID_SHIPPING_TRANSITIONS,
      return: VALID_RETURN_TRANSITIONS
    }[transitionType] || VALID_ORDER_TRANSITIONS;

    const allowed = transitions[currentStatus] || [];
    throw new Error(
      `Invalid ${entityName.toLowerCase()} status transition: "${currentStatus}" → "${newStatus}". ` +
      `Allowed next statuses: ${allowed.length > 0 ? allowed.join(", ") : "none (terminal state)"}.`
    );
  }
}

/**
 * Gets all valid next statuses for a given current status
 * @param {string} currentStatus - The current status
 * @param {string} transitionType - Type of transition: 'order', 'payment', 'shipping', 'return'
 * @returns {string[]} - Array of valid next statuses
 */
export function getValidNextStatuses(currentStatus, transitionType = "order") {
  const transitions = {
    order: VALID_ORDER_TRANSITIONS,
    payment: VALID_PAYMENT_TRANSITIONS,
    shipping: VALID_SHIPPING_TRANSITIONS,
    return: VALID_RETURN_TRANSITIONS
  }[transitionType] || VALID_ORDER_TRANSITIONS;

  return transitions[currentStatus] || [];
}

/**
 * Creates a timeline entry for a status change
 * @param {Object} params - Timeline entry parameters
 * @returns {Object} - Timeline entry object
 */
export function createTimelineEntry({
  title,
  note = "",
  source = "order",
  actor = "system",
  actorId = null,
  actorModel = null,
  metadata = {},
  createdAt = null,
  updatedAt = null,
  timestamp = null
}) {
  const eventTime = timestamp || createdAt || new Date();
  return {
    title,
    note,
    done: true,
    active: false,
    source,
    actor,
    actorId,
    actorModel,
    metadata,
    createdAt: createdAt || eventTime,
    updatedAt: updatedAt || eventTime,
    timestamp: timestamp || eventTime
  };
}

/**
 * Determines the source type based on transition type
 * @param {string} transitionType - Type of transition
 * @returns {string} - Source type for timeline
 */
export function getTimelineSource(transitionType) {
  const sourceMap = {
    order: "order",
    payment: "payment",
    shipping: "shipping",
    return: "return",
    refund: "refund"
  };
  return sourceMap[transitionType] || "order";
}

/**
 * Determines the actor type based on who is making the change
 * @param {string} userRole - User role (customer, admin, system, courier)
 * @returns {string} - Actor type
 */
export function getTimelineActor(userRole) {
  const roleMap = {
    customer: "customer",
    admin: "admin",
    superadmin: "admin",
    system: "system",
    courier: "courier"
  };
  return roleMap[userRole?.toLowerCase()] || "system";
}