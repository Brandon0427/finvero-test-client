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
            
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
            
        ]
    },

    {
        Category: "Solución",
        Line: "Avizor",
        Product: "",
        Capacity: []
    }
]

export { sampleData }