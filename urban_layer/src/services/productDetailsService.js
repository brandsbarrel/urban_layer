const HERO_IMAGE =
    'https://lh3.googleusercontent.com/aida/AP1WRLvHwFa1iVhVbkK3O_RKJyWNv8dIJMma8U07igJB9lKC9-MMi2NszWyoORmk6WCppfyf7qa3utDKbKZC3XznACvlkkyJ6nVjX3yZBHnWL3C9M81meqkLKHhr611Lj7HUZvc0doNWx7BfrceVEjB_5wXrDWfsFUzAFeagSVUfmeqqcqtPzC3znEBgQfteGIj3aMrmla-yqxy9XtfzZg49kqr1Vhc5rwFeG9ByysQhqr8sfno-JSh2mF1oJA';

const productDetails = {
    'heritage-leather': {
        id: 'heritage-leather',
        name: 'Heritage Leather Case',
        tagline: "'Handcrafted for the Modern Nomad'",
        price: 3999,
        rating: 4.9,
        reviewCount: 124,
        badge: 'NEW ARRIVAL',
        breadcrumb: [
            { label: 'Home', path: '/' },
            { label: 'Collections', path: '/collections' },
            { label: 'Phone Cases', path: '/shop' },
            { label: 'Heritage Leather' },
        ],
        heroImage: HERO_IMAGE,
        thumbnails: [
            {
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVLXdhiXStiQRF-JSXkjDGDg3XUXTS-u1EiT61QW3PJZa_qyhJaLqx8A7QhnS02oc1VjoUWonFUNvcFeuHq0fRJi2uWeEFvyxUtjPG3QXw_6TYQP4HfOTldxddcsvyJLzmpqPgsFFQuEO9cvkQq1TrGdQlTH0FY8fMw273A-T4sjshbJj0LnrMRN9AL-yFX0QeJK6VndZOoJd1P4QmtidSseXiwmDwkgrKJdTmlXZ65zlOK9mzTTOfQU08cRnO2vngI7XsEKVILjA',
                alt: 'Macro shot of leather texture',
            },
            {
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwWpLyLigCl1ehN8R5KNhrCT4DWaF8u5x2rkF9sbyXEIn6mY9LJecdyYa1F3s6Fr0cIJ0ujH5Tnj0XcQejIaXJ0hHhL_kGI2czczUv7w-roiVzKHKmpsrie2n94AuCDHrU9WZlzVoBs6nC-0vfpqmimPqtt_mEXZ11Sdh_AfIU-W-zf_wjUWz1dqqaeK5gmZgpEM_A3gI-xhPWzQsyiB7-LWaZx2GpqEq2PXv3DNpKecj9ZxfpyA72otxOLjg3Wc2rseJLkuo3BZ8',
                alt: 'Side view showing hand-stitched detailing',
            },
            {
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA01lhStdJ2PVoMLplU2n_MLvgaZ2cS97ykmkoUg-kwymeY6j6VjP4VU6XIiX8TQFCzrVhgR5xiifib0Rn0fpjd_lGzNcsBHcCMUUsln4ja2qxygvmLEEnZzb2VsRmqo5vraHkfhJo4MhtTMJGfrBxEheo23tzWXPsXvyMdMEnRiVqibYrgxJFDEZeOilwy_Q6YKyJOApUlTAlL2s-gWoPz8zKVSd61keEk6bFx7KRXhR5j_B1Of6rDJtEqCNXQdVRHlqDvlQouWkY',
                alt: 'Interior micro-suede lining with embossed logo',
            },
        ],
        models: [
            { id: 'iphone-15-pro', label: 'iPhone 15 Pro' },
            { id: 'iphone-15-pro-max', label: '15 Pro Max' },
        ],
        colors: [
            { id: 'tan-suede', label: 'Tan Suede', hex: '#A0522D' },
            { id: 'jet-black', label: 'Jet Black', hex: '#1B1B1B' },
            { id: 'graphite', label: 'Graphite', hex: '#4A4A4A' },
        ],
        featureList: [
            { icon: 'verified_user', label: 'Military Grade Drop Protection' },
            { icon: 'bolt', label: 'Full MagSafe® Compatibility' },
            { icon: 'eco', label: 'Sustainably Sourced Italian Leather' },
        ],
        bentoFeatures: [
            {
                icon: 'shield',
                title: 'Military Protection',
                description:
                    'Polycarbonate internal shell tested to survive drops from 10 feet without compromising slim profile.',
            },
            {
                icon: 'animation',
                title: 'MagSafe Ready',
                description:
                    'Embedded neodymium magnet array ensures seamless alignment with all wireless chargers and wallets.',
            },
            {
                icon: 'architecture',
                title: 'Hand-Stitched',
                description:
                    'Each piece is individually hand-finished by master craftsmen using signature wax-coated thread.',
            },
        ],
        editorialHighlights: [
            {
                image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuAX49glaXKtzbEZGzUobv6NDBRyzko5YqCyz9BkasAeLfFPI5hWvOOW7cXpzsugZ7f6kwzun11w7Z_x95Va0PiLZ_wKVOFpOi5qz5Her7UvX2ytlgRRnjht2vr7N0s1PNp1BsOylignIy3jAvVy65u0UW1lDE0TMsto6nnC1zx3AG1LPhZ83RW2vS4kux_t-Ejz-3aAN9oT3AcBsafLc9n69V0u1vKztzZtGd4qEN097Vei1Gk4saB4DultCEfmHdjHskKFAHoubqE',
                imageAlt: 'Macro texture of full-grain leather',
                eyebrow: 'The Texture',
                heading: 'Full-Grain Italian Leather',
                description:
                    'Sourced from elite tanneries, our leather is chosen for its ability to develop a unique patina over time. Every scratch and mark tells your story, making the case exclusively yours.',
                imagePosition: 'left',
            },
            {
                image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCTDOE2ER5Yz4YMViAoG1lkw2Qzag0ezTtKWz7vbDcajalNFnQ5lDtr572NEuV0txats3mXRWDdifwV4yNWwcNg6Hw90Jmgdc9UNbLKu_bkwvxfm4jaLaoWLmiMVT-EZ0qIIPY5aNRWOv3Oaj-B8tpQfHt-tWvujE6EXNrH6qZ8-xMbADFGmVrORpAXkTTk1Ry3jGfD11dfjybswpfXp2zuWSZOxzJ0YLKaW6XMN1nxIW1NRqBao1AhJAex5MhTGxxFta62hf5USh8',
                imageAlt: 'Close-up of machined gold camera ring',
                eyebrow: 'The Precision',
                heading: 'Machined Metal Accents',
                description:
                    'Precision-engineered button covers and a raised camera ring are machined from aircraft-grade aluminum. Finished in signature Urban Gold, they provide tactile feedback and superior protection.',
                imagePosition: 'right',
            },
        ],
        lifestyleBanner: {
            image: HERO_IMAGE,
            imageAlt: 'Person in urban setting with phone case',
            heading: 'Urban Sophistication',
            description:
                'Designed for those who navigate the concrete jungle with elegance. The Heritage Leather Case is the perfect companion for the modern boardroom and beyond.',
        },
        bundle: {
            id: 'heritage-kit-bundle',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuChtgWAH7DsERUi-tUyYdKdG8Q3zXmqMiSR9A_UMSkfHvMWe-Xco47hCbKGxIymfKlpV9rQLxzhGfvhhEgfN9Qk4mftklpVflJJ66JXMf-jVtM1Kl7IvXdq9k-4MN11y56aOZrw6c3sZG5-mNsCS8UhsszPV-Tijs0hd2RiXs3OBilC7RZnVFQPrpb__miyyTj0hQ878vOJToqwcCCH-nHfgngWTRz5dzduBgUA3XMAcTNUspT63qHjv7iSpidzcjmEa5eR4j2QvXc',
            imageAlt: 'Heritage Kit bundle: case, screen guard, wallet',
            eyebrow: 'Frequently Bought Together',
            title: 'Complete Your Heritage Kit',
            description:
                'Protect your device from every angle. Includes Heritage Leather Case + Sapphire Glass Guard + MagSafe Card Wallet.',
            price: 6499,
            originalPrice: 7997,
            discountLabel: 'SAVE 20%',
            ctaLabel: 'Add Bundle to Cart',
        },
        reviews: [
            {
                title: 'Absolute Masterpiece',
                quote:
                    'The quality of the leather is unmatched. It feels like a high-end luxury handbag. The patina after 2 months is gorgeous.',
                name: 'Aryan M.',
                rating: 5,
            },
            {
                title: 'Perfect Fit',
                quote:
                    'MagSafe magnets are very strong. The gold buttons have a satisfying click. Well worth the investment.',
                name: 'Sarah K.',
                rating: 5,
            },
            {
                title: 'Classy & Strong',
                quote:
                    'I dropped it on concrete and both the case and phone survived without a scratch. Highly recommended.',
                name: 'James W.',
                rating: 4.5,
            },
        ],
    },
};

export function getProductDetails(productId) {
    return productDetails[productId] || null;
}