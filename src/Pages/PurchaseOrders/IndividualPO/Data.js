const sampleData = [
    {
        Category: "Lente de Contacto",
        Line: "Acuvue",
        Product: "Oasys",
        Sphere: [
            "-10.00", "-9.50", "-9.00", "-8.50", "-8.00", "-7.50", "-7.00", "-6.50", "-6.00",
            "-5.75", "-5.50", "-5.25", "-5.00", "-4.75", "-4.50", "-4.25", "-4.00",
            "-3.75", "-3.50", "-3.25", "-3.00", "-2.75", "-2.50", "-2.25", "-2.00",
            "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25", "Neutro",
            "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00",
            "+2.25", "+2.50", "+2.75", "+3.00", "+3.25", "+3.50", "+3.75", "+4.00",
            "+4.25", "+4.50", "+4.75", "+4.00", "+4.50", "+5.00", "+5.50", "+6.00"
            
        ],
        UnitPrice: 435
    },

    {
        Category: "Lente de Contacto de Color",
        Line: "Air Optix",
        Product: "Colors",
        Color: ["Pure Hazel", "Emerald", "Gray Blue", "Blue", "Honey", "Brown", "Gray"],
        Sphere: [
            "-10.00", "-9.50", "-9.00", "-8.50", "-8.00", "-7.50", "-7.00", "-6.50", "-6.00",
            "-5.75", "-5.50", "-5.25", "-5.00", "-4.75", "-4.50", "-4.25", "-4.00",
            "-3.75", "-3.50", "-3.25", "-3.00", "-2.75", "-2.50", "-2.25", "-2.00",
            "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25", "Neutro",
            "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00"
        ],
        UnitPrice: 377
    },

    {
        Category: "Lente de Contacto de Color",
        Line: "Freshlook",
        Product: "Colorblends",
        Color: ["Green", "Blue", "Brown", "Gray"],
        Sphere: [
            "-10.00", "-9.50", "-9.00", "-8.50", "-8.00", "-7.50", "-7.00", "-6.50", "-6.00",
            "-5.75", "-5.50", "-5.25", "-5.00", "-4.75", "-4.50", "-4.25", "-4.00",
            "-3.75", "-3.50", "-3.25", "-3.00", "-2.75", "-2.50", "-2.25", "-2.00",
            "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25", "Neutro",
            "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00"
        ],
        UnitPrice: 170
    },

    {
        Category: "Lente de Contacto Astigmatismo",
        Line: "Bausch & Lomb",
        Product: "Soflens Astigmatismo",
        Sphere: [
            "-10.00", "-9.50", "-9.00", "-8.50", "-8.00", "-7.50", "-7.00", "-6.50", "-6.00",
            "-5.75", "-5.50", "-5.25", "-5.00", "-4.75", "-4.50", "-4.25", "-4.00",
            "-3.75", "-3.50", "-3.25", "-3.00", "-2.75", "-2.50", "-2.25", "-2.00",
            "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25", "Neutro",
            "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00",
            "+2.25", "+2.50", "+2.75", "+3.00", "+3.25", "+3.50", "+3.75", "+4.00",
        ],
        Cylinder: [
            "-2.00", "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25", "Neutro",
        ],
        Axis: [
            "0º", "10º", "20º", "30º", "40º", "50º", "60º", "70º", "80º", "90º",
            "100º", "110º", "120º", "130º", "140º", "150º", "160º", "170º", "180º"
        ],
        UnitPrice: 422
    },

    {
        Category: "Lente de Contacto Astigmatismo",
        Line: "Coopervision",
        Product: "Biofinity Toric",
        Sphere: [
            "-10.00", "-9.50", "-9.00", "-8.50", "-8.00", "-7.50", "-7.00", "-6.50", "-6.00",
            "-5.75", "-5.50", "-5.25", "-5.00", "-4.75", "-4.50", "-4.25", "-4.00",
            "-3.75", "-3.50", "-3.25", "-3.00", "-2.75", "-2.50", "-2.25", "-2.00",
            "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25", "Neutro",
            "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00",
            "+2.25", "+2.50", "+2.75", "+3.00", "+3.25", "+3.50", "+3.75", "+4.00",
        ],
        Cylinder: [
            "-2.00", "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25", "Neutro",
        ],
        Axis: [
            "0º", "10º", "20º", "30º", "40º", "50º", "60º", "70º", "80º", "90º",
            "100º", "110º", "120º", "130º", "140º", "150º", "160º", "170º", "180º"
        ],
        UnitPrice: 659
    },

    {
        Category: "Lente de Contacto",
        Line: "Hidrosoft",
        Product: "UV Soft",
        Sphere: [
            "-10.00", "-9.50", "-9.00", "-8.50", "-8.00", "-7.50", "-7.00", "-6.50", "-6.00",
            "-5.75", "-5.50", "-5.25", "-5.00", "-4.75", "-4.50", "-4.25", "-4.00",
            "-3.75", "-3.50", "-3.25", "-3.00", "-2.75", "-2.50", "-2.25", "-2.00",
            "-1.75", "-1.50", "-1.25", "-1.00", "-0.75", "-0.50", "-0.25", "Neutro",
            "+0.25", "+0.50", "+0.75", "+1.00", "+1.25", "+1.50", "+1.75", "+2.00",
            "+2.25", "+2.50", "+2.75", "+3.00", "+3.25", "+3.50", "+3.75", "+4.00",
            "+4.25", "+4.50", "+4.75", "+4.00", "+4.50", "+5.00", "+5.50", "+6.00"
            
        ],
        UnitPrice: 540
    },

    ////////////////////////Soluciones////////////////////////

    {
        Category: "Solución",
        Line: "Bausch & Lomb",
        Product: "Bio True",
        Capacity: ["60mL", "100mL", "300mL"],
        UnitPrice: [92, 128, 190]
    },

    {
        Category: "Solución",
        Line: "Bausch & Lomb",
        Product: "Renu Fresh",
        Capacity: ["60mL", "500mL"],
        UnitPrice: [80.17, 232]
    },

    {
        Category: "Solución",
        Line: "Bausch & Lomb",
        Product: "Renu Plus",
        Capacity: ["8mL", "500mL"],
        UnitPrice: [106, 216.38]
    },

    {
        Category: "Solución",
        Line: "Bausch & Lomb",
        Product: "Simplus",
        Capacity: ["105mL"],
        UnitPrice: [150.86]
    },

    {
        Category: "Solución",
        Line: "Bausch & Lomb",
        Product: "Artelac Rebalance",
        Capacity: ["10mL"],
        UnitPrice: [461.21]
    },

    {
        Category: "Solución",
        Line: "Bausch & Lomb",
        Product: "Ocudrive Advanced",
        Capacity: ["50 caps"],
        UnitPrice: [543.97]
    },

    {
        Category: "Solución",
        Line: "Bausch & Lomb",
        Product: "Moisture Eyes",
        Capacity: ["15mL"],
        UnitPrice: [91.38]
    },

    {
        Category: "Solución",
        Line: "Alcon",
        Product: "Ao Sept Plus",
        Capacity: ["355mL"],
        UnitPrice: [181]
    },

    {
        Category: "Solución",
        Line: "Alcon",
        Product: "Optifree Pure Moist",
        Capacity: ["10mL", "90mL"],
        UnitPrice: [58.62, 81.03]
    },

    {
        Category: "Solución",
        Line: "Alcon",
        Product: "Systane Balance",
        Capacity: ["10mL"],
        UnitPrice: [381.90]
    },

    {
        Category: "Solución",
        Line: "Alcon",
        Product: "Systane Gel",
        Capacity: ["10mL"],
        UnitPrice: [368.10]
    },

    {
        Category: "Solución",
        Line: "Alcon",
        Product: "Systane",
        Capacity: ["15mL"],
        UnitPrice: [385.34]
    },

    {
        Category: "Solución",
        Line: "Alcon",
        Product: "Systane Ultra",
        Capacity: ["10mL"],
        UnitPrice: [418.97]
    },

    {
        Category: "Solución",
        Line: "Alcon",
        Product: "Systane Ultra Unidosis",
        Capacity: ["30 x 0.7 mL"],
        UnitPrice: [432.76]
    },

    {
        Category: "Solución",
        Line: "Alcon",
        Product: "Systane Complete",
        Capacity: ["10mL"],
        UnitPrice: [416.38]
    },

    {
        Category: "Solución",
        Line: "Alcon",
        Product: "Systane Toallitas",
        Capacity: ["30 toallitas"],
        UnitPrice: [247.41]
    },

    {
        Category: "Solución",
        Line: "Hidrosoft",
        Product: "Optigas",
        Capacity: ["60mL"],
        UnitPrice: [163.79]
    },

    {
        Category: "Solución",
        Line: "Hidrosoft",
        Product: "Lubrilens",
        Capacity: ["15mL"],
        UnitPrice: [81.90]
    },

    {
        Category: "Solución",
        Line: "Poyssa",
        Product: "Multiplus",
        Capacity: ["120mL", "360mL"],
        UnitPrice: [31, 62.07]
    },

    {
        Category: "Solución",
        Line: "Poyssa",
        Product: "Multiplus Ultra",
        Capacity: ["360mL"],
        UnitPrice: [92.24]
    },

    {
        Category: "Solución",
        Line: "Avizor",
        Product: "All Clean Soft",
        Capacity: ["350mL"],
        UnitPrice: [110.34]
    },

    {
        Category: "Solución",
        Line: "Avizor",
        Product: "Unica Sensitive",
        Capacity: ["350mL"],
        UnitPrice: [122.41]
    },

    {
        Category: "Solución",
        Line: "Avizor",
        Product: "GP Conditioner",
        Capacity: ["120mL"],
        UnitPrice: [107.76]
    },

    {
        Category: "Solución",
        Line: "Avizor",
        Product: "GP Cleaner",
        Capacity: ["30mL"],
        UnitPrice: [117]
    },

    {
        Category: "Solución",
        Line: "Avizor",
        Product: "GP Multi",
        Capacity: ["240mL"],
        UnitPrice: [115.52]
    },

    {
        Category: "Solución",
        Line: "Avizor",
        Product: "Lacri-fresh Ocu-dry",
        Capacity: ["20 x 0.4mL"],
        UnitPrice: [233.62]
    },

    {
        Category: "Solución",
        Line: "Avizor",
        Product: "Saline Unidose",
        Capacity: ["30 x 5 mL"],
        UnitPrice: [251]
    },

    {
        Category: "Solución",
        Line: "Avizor",
        Product: "Lacrifresh Cleaning",
        Capacity: ["15mL"],
        UnitPrice: [78.45]
    },

    {
        Category: "Solución",
        Line: "Ilsa",
        Product: "Contaxine",
        Capacity: ["70mL"],
        UnitPrice: [70]
    },
]

export { sampleData }