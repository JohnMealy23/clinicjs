const responseModel = {
    results: [
        {
            name: 'Clinic 1',
            isPartner: true,
            hours: {
                monday: {
                    start: 800,
                    end: 2000
                },
                tuesday: {
                    start: 800,
                    end: 2000
                },
                wednesday: {
                    start: 800,
                    end: 2000
                },
                thursday: {
                    start: 800,
                    end: 2000
                },
                friday: {
                    start: 800,
                    end: 2000
                },
                saturday: false,
                sunday: false,
                confirmed: true
            },
            contact: {
                phone: '555.555.5555',
                lastConfirmed: 1484254654776,
                instructions: 'To call anonymously, do the following...',
                website: 'aclinic.com'
            },
            price: {
                resident: 185,
                nonresident: 210,
                student: 170,
                medicaid: 100
            },
            location: {
                lat: 39.086922,
                lng: -110.752961,
                street: '121 whatevs St.',
                city: 'Nextonover',
                state: 'WA',
                zip: 98502
            },
            rating: {
                score: 4.3,
                reviews: [
                    {
                        score: 5,
                        review: 'They were great!'
                    },
                    {
                        score: 4,
                        review: 'They were pretty good!'
                    },
                    {
                        score: 4,
                        review: 'I also felt they were pretty good!'
                    }
                ]
            },
            laws: [
                {
                    title: 'Law X',
                    description: 'Law X is such and such.'
                },
                {
                    title: 'Law Y',
                    description: 'Law Y is so and so.'
                }
            ],
            instruction: [
                'Bring parent consent form',
                'Bring two forms of ID',
                'Two visits will be necessary, at least a week apart.',
                'A prenatal exam will be necessary.'
            ]
        },
        {
            name: 'Clinic 2',
            isPartner: false,
            hours: {
                monday: {
                    start: 900,
                    end: 1800
                },
                tuesday: {
                    start: 900,
                    end: 1800
                },
                wednesday: {
                    start: 900,
                    end: 1800
                },
                thursday: {
                    start: 900,
                    end: 1800
                },
                friday: {
                    start: 900,
                    end: 1800
                },
                saturday: {
                    start: 1200,
                    end: 1800
                },
                sunday: {
                    start: 1200,
                    end: 1800
                },
                confirmed: false
            },
            contact: {
                phone: '555.666.7777',
                lastConfirmed: false,
                instructions: '',
                website: 'anotherclinic.com'
            },
            price: {
                resident: 100,
                nonresident: 110,
                student: 90,
                medicaid: 70
            },
            location: {
                lat: 38,
                lng: -109.78,
                street: '341 whateva Lane',
                city: 'Nextonover',
                state: 'WA',
                zip: 98503
            },
            rating: {
                score: 4.6,
                reviews: [
                    {
                        score: 5,
                        review: 'They were great!'
                    },
                    {
                        score: 5,
                        review: 'They were awfully good!'
                    },
                    {
                        score: 4,
                        review: 'I felt they were pretty good!'
                    }
                ]
            },
            laws: [
                {
                    title: 'Law X',
                    description: 'Law X is such and such.'
                },
                {
                    title: 'Law Y',
                    description: 'Law Y is so and so.'
                }
            ],
            instruction: [
                'Bring parent consent form',
                'Bring two forms of ID',
                'Two visits will be necessary, at least a week apart.'
            ]
        },
    ]
};

export default responseModel;