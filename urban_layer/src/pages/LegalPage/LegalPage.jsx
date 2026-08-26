import styles from './LegalPage.module.css';

const PRIVACY_SECTIONS = [
    {
        title: '1. Information We Collect',
        paragraphs: [
            'When you browse our website, place an order, or contact us, we may collect information such as name, mobile number, email address, billing and shipping address, order and purchase details, support information, device details, browser information, IP address, and website usage information.',
            'We only collect information that is reasonably necessary to operate our website and provide our services.',
        ],
    },
    {
        title: '2. How We Use Your Information',
        paragraphs: [
            'We may use your information to process and fulfil orders, deliver products, send order and delivery updates, provide customer support, respond to enquiries, improve our website and services, prevent fraud or misuse, maintain website security, and comply with applicable legal requirements.',
        ],
    },
    {
        title: '3. Sharing of Information',
        paragraphs: [
            'Urban Layers does not sell or rent your personal information to third parties.',
            'We may share necessary information with trusted service providers such as shipping partners, technology providers, support providers, analytics providers, and government or law-enforcement agencies where legally required.',
        ],
    },
    {
        title: '4. Cookies',
        paragraphs: [
            'Our website may use cookies and similar technologies to remember preferences, maintain shopping cart functionality, understand usage, and improve performance. You may control or disable cookies through your browser settings, but some functionality may be affected.',
        ],
    },
    {
        title: '5. Data Security',
        paragraphs: [
            'We take reasonable measures to protect personal information against unauthorized access, misuse, alteration, disclosure, or destruction. However, no internet transmission or electronic storage method can be guaranteed to be completely secure.',
        ],
    },
    {
        title: '6. Data Retention',
        paragraphs: [
            'We retain personal information only as long as reasonably necessary for legitimate business purposes, including order processing, customer support, transaction records, dispute resolution, fraud prevention, and legal compliance.',
        ],
    },
    {
        title: '7. Your Privacy Choices',
        paragraphs: [
            'Where applicable under law, you may request access to, correction of, or deletion of your personal information. You may also contact us with concerns about how your information is handled.',
        ],
    },
    {
        title: '8. Children\'s Privacy',
        paragraphs: [
            'Our website is intended for general consumers and is not specifically directed toward children. We do not knowingly collect personal information from children in violation of applicable law.',
        ],
    },
    {
        title: '9. Third-Party Websites',
        paragraphs: [
            'Our website may contain links to third-party websites or services. Urban Layers is not responsible for the privacy practices, content, or security of third-party websites.',
        ],
    },
    {
        title: '10. Changes to This Privacy Policy',
        paragraphs: [
            'Urban Layers may update this Privacy Policy from time to time. Any updated version will be published on this page with a revised Last Updated date.',
        ],
    },
    {
        title: '11. Contact Us',
        paragraphs: ['For questions, concerns, or requests regarding this Privacy Policy, contact Urban Layers at support@urbanlayers.co.'],
    },
];

const TERMS_SECTIONS = [
    {
        title: '1. About Urban Layers',
        paragraphs: ['Urban Layers is an online brand offering mobile phone cases and related products. In these Terms & Conditions, Urban Layers, we, us, and our refer to Urban Layers, while you and customer refer to the person using our website or purchasing our products.'],
    },
    {
        title: '2. Use of Our Website',
        paragraphs: ['You agree to use the Urban Layers website only for lawful purposes. You must not use the website for fraudulent activities, attempt unauthorized access, interfere with security or functionality, copy content without permission, misuse our brand or products, or transmit malicious software.'],
    },
    {
        title: '3. Product Information',
        paragraphs: ['We make reasonable efforts to ensure product descriptions, images, specifications, colours, and information are accurate. Minor differences may occur due to screen settings, photography, lighting, or manufacturing variations and do not necessarily constitute a product defect.'],
    },
    {
        title: '4. Product Availability',
        paragraphs: ['All products are subject to availability. Urban Layers may change availability, discontinue products, modify specifications, or correct product information and pricing errors.'],
    },
    {
        title: '5. Pricing',
        paragraphs: ['Product prices may be changed or updated from time to time without prior notice. Urban Layers reserves the right to correct accidental pricing, product, or listing errors.'],
    },
    {
        title: '6. Orders',
        paragraphs: ['Customers are responsible for providing accurate and complete order information, including full name, contact number, email address where applicable, and complete shipping address. Urban Layers is not responsible for delivery issues caused by incorrect or incomplete information.'],
    },
    {
        title: '7. Payment & Cash on Delivery',
        paragraphs: ['Urban Layers accepts Cash on Delivery along with other payment methods displayed during checkout. For COD orders, customers agree to provide accurate contact and delivery information and remain available to receive the order.'],
    },
    {
        title: '8. Shipping & Delivery',
        paragraphs: ['Urban Layers provides Pan-India shipping. Free shipping is applicable to orders placed through our website, subject to the shipping terms displayed at checkout. Delivery timelines are estimates and may vary by state, city, location, courier availability, logistics conditions, weather, or circumstances beyond our reasonable control.'],
    },
    {
        title: '9. Cancellation Policy',
        paragraphs: ['Orders once placed cannot be cancelled. Customers should carefully review product selection, quantity, and shipping information before placing an order.'],
    },
    {
        title: '10. Return Policy',
        paragraphs: ['All purchases made through Urban Layers are non-returnable. Once a product has been delivered, it cannot be returned under the standard return policy.'],
    },
    {
        title: '11. Replacement Policy',
        paragraphs: ['Urban Layers does not provide product replacements under its standard policy. Nothing in this policy is intended to limit any rights or protections that cannot legally be excluded under applicable law.'],
    },
    {
        title: '12. Intellectual Property',
        paragraphs: ['All website content, including the Urban Layers name and logo, product images, graphics, designs, text, videos, product descriptions, website layout, and marketing materials, is owned by or licensed to Urban Layers and protected by applicable intellectual-property laws.'],
    },
    {
        title: '13. Third-Party Services and Links',
        paragraphs: ['Our website may contain links to or integrations with third-party services. Urban Layers does not control and is not responsible for third-party availability, content, security, or policies.'],
    },
    {
        title: '14. Website Availability',
        paragraphs: ['Urban Layers makes reasonable efforts to keep the website available, but does not guarantee uninterrupted, error-free, or constant availability.'],
    },
    {
        title: '15. Limitation of Liability',
        paragraphs: ['To the maximum extent permitted by applicable law, Urban Layers shall not be liable for indirect, incidental, special, or consequential losses arising from use of our website or products.'],
    },
    {
        title: '16. Changes to These Terms',
        paragraphs: ['Urban Layers may update these Terms & Conditions from time to time. Continued use of the website after changes are published constitutes acceptance of the updated Terms, to the extent permitted by applicable law.'],
    },
    {
        title: '17. Governing Law',
        paragraphs: ['These Terms & Conditions shall be governed by the applicable laws of India. Any disputes shall be handled in accordance with applicable laws and the jurisdiction of the competent courts.'],
    },
    {
        title: '18. Contact Us',
        paragraphs: ['For questions regarding these Terms & Conditions, contact Urban Layers at support@urbanlayers.co.'],
    },
];

const CONTENT = {
    privacy: {
        title: 'Privacy Policy',
        updated: 'Last Updated: August 26, 2026',
        intro: [
            'At Urban Layers, we respect your privacy and are committed to protecting the personal information you provide to us.',
            'This Privacy Policy explains how Urban Layers collects, uses, stores, and protects your information when you visit or use our website. By using our website, you agree to the practices described in this Privacy Policy.',
        ],
        sections: PRIVACY_SECTIONS,
    },
    terms: {
        title: 'Terms & Conditions',
        updated: 'Last Updated: August 26, 2026',
        intro: [
            'Welcome to Urban Layers.',
            'These Terms & Conditions govern your use of the Urban Layers website and your purchase of products through our website. By accessing or using our website, you agree to be bound by these Terms & Conditions.',
        ],
        sections: TERMS_SECTIONS,
    },
};

function LegalPage({ type }) {
    const content = CONTENT[type];

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <span className={styles.kicker}>Urban Layers Co.</span>
                <h1 className={styles.title}>{content.title}</h1>
                <p className={styles.updated}>{content.updated}</p>
            </section>

            <section className={styles.content}>
                {content.intro.map((paragraph) => (
                    <p key={paragraph} className={styles.lead}>{paragraph}</p>
                ))}

                {content.sections.map((section) => (
                    <article className={styles.section} key={section.title}>
                        <h2 className={styles.sectionTitle}>{section.title}</h2>
                        {section.paragraphs.map((paragraph) => (
                            <p className={styles.paragraph} key={paragraph}>{paragraph}</p>
                        ))}
                    </article>
                ))}
            </section>
        </main>
    );
}

export default LegalPage;
