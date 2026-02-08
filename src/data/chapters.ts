// Sample chapters for the Maths Test application
export interface ChapterData {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
}

export const CHAPTERS: ChapterData[] = [
    {
        id: "algebra",
        name: "Algebra",
        description: "Equations, expressions, and polynomials",
        color: "#ec4899",
        icon: "🔢",
    },
    {
        id: "geometry",
        name: "Geometry",
        description: "Shapes, angles, and spatial reasoning",
        color: "#8b5cf6",
        icon: "📐",
    },
    {
        id: "trigonometry",
        name: "Trigonometry",
        description: "Sine, cosine, tangent, and applications",
        color: "#3b82f6",
        icon: "📊",
    },
    {
        id: "calculus",
        name: "Calculus",
        description: "Derivatives, integrals, and limits",
        color: "#10b981",
        icon: "∫",
    },
    {
        id: "statistics",
        name: "Statistics",
        description: "Probability, data analysis, and distributions",
        color: "#f59e0b",
        icon: "📈",
    },
];

// Sample questions for each chapter
export interface QuestionData {
    chapterId: string;
    questionText: string;
    options: string[];
    correctAnswer: number;
}

export const SAMPLE_QUESTIONS: QuestionData[] = [
    // Algebra
    {
        chapterId: "algebra",
        questionText: "Solve for x: 2x + 5 = 13",
        options: ["x = 2", "x = 4", "x = 6", "x = 8"],
        correctAnswer: 1,
    },
    {
        chapterId: "algebra",
        questionText: "Simplify: (3x² + 2x) - (x² - 4x)",
        options: ["2x² + 6x", "2x² - 2x", "4x² + 6x", "4x² - 2x"],
        correctAnswer: 0,
    },
    {
        chapterId: "algebra",
        questionText: "Factor: x² - 9",
        options: ["(x-3)²", "(x+3)²", "(x-3)(x+3)", "(x-9)(x+1)"],
        correctAnswer: 2,
    },
    {
        chapterId: "algebra",
        questionText: "What is the value of x in 3x - 7 = 14?",
        options: ["x = 3", "x = 5", "x = 7", "x = 21"],
        correctAnswer: 2,
    },
    {
        chapterId: "algebra",
        questionText: "Solve: x² = 49",
        options: ["x = 7", "x = -7", "x = ±7", "x = 49"],
        correctAnswer: 2,
    },

    // Geometry
    {
        chapterId: "geometry",
        questionText: "What is the sum of interior angles in a triangle?",
        options: ["90°", "180°", "270°", "360°"],
        correctAnswer: 1,
    },
    {
        chapterId: "geometry",
        questionText: "Calculate the area of a circle with radius 5 cm (Use π = 3.14)",
        options: ["31.4 cm²", "78.5 cm²", "15.7 cm²", "25 cm²"],
        correctAnswer: 1,
    },
    {
        chapterId: "geometry",
        questionText: "In a right triangle, if one angle is 90°, what is the sum of the other two angles?",
        options: ["90°", "180°", "270°", "45°"],
        correctAnswer: 0,
    },
    {
        chapterId: "geometry",
        questionText: "What is the perimeter of a square with side 8 cm?",
        options: ["16 cm", "24 cm", "32 cm", "64 cm"],
        correctAnswer: 2,
    },
    {
        chapterId: "geometry",
        questionText: "A rectangle has length 12 cm and width 5 cm. What is its area?",
        options: ["17 cm²", "34 cm²", "60 cm²", "120 cm²"],
        correctAnswer: 2,
    },

    // Trigonometry
    {
        chapterId: "trigonometry",
        questionText: "What is sin(90°)?",
        options: ["0", "1", "-1", "undefined"],
        correctAnswer: 1,
    },
    {
        chapterId: "trigonometry",
        questionText: "What is cos(0°)?",
        options: ["0", "1", "-1", "undefined"],
        correctAnswer: 1,
    },
    {
        chapterId: "trigonometry",
        questionText: "If sin(θ) = 0.5, what is θ?",
        options: ["30°", "45°", "60°", "90°"],
        correctAnswer: 0,
    },
    {
        chapterId: "trigonometry",
        questionText: "What is tan(45°)?",
        options: ["0", "1", "√2", "undefined"],
        correctAnswer: 1,
    },
    {
        chapterId: "trigonometry",
        questionText: "In a right triangle, if opposite = 3 and adjacent = 4, what is the hypotenuse?",
        options: ["5", "6", "7", "12"],
        correctAnswer: 0,
    },

    // Calculus
    {
        chapterId: "calculus",
        questionText: "What is the derivative of x²?",
        options: ["x", "2x", "x²", "2x²"],
        correctAnswer: 1,
    },
    {
        chapterId: "calculus",
        questionText: "What is the derivative of sin(x)?",
        options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
        correctAnswer: 0,
    },
    {
        chapterId: "calculus",
        questionText: "What is ∫ 2x dx?",
        options: ["x²", "x² + C", "2x²", "2x² + C"],
        correctAnswer: 1,
    },
    {
        chapterId: "calculus",
        questionText: "What is the limit of (1/x) as x approaches infinity?",
        options: ["0", "1", "∞", "undefined"],
        correctAnswer: 0,
    },
    {
        chapterId: "calculus",
        questionText: "What is the derivative of e^x?",
        options: ["e^x", "xe^(x-1)", "x·e^x", "1"],
        correctAnswer: 0,
    },

    // Statistics
    {
        chapterId: "statistics",
        questionText: "What is the mean of: 2, 4, 6, 8, 10?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 1,
    },
    {
        chapterId: "statistics",
        questionText: "What is the median of: 3, 7, 2, 9, 4?",
        options: ["3", "4", "5", "7"],
        correctAnswer: 1,
    },
    {
        chapterId: "statistics",
        questionText: "What is the mode of: 1, 2, 2, 3, 4, 2, 5?",
        options: ["1", "2", "3", "5"],
        correctAnswer: 1,
    },
    {
        chapterId: "statistics",
        questionText: "If P(A) = 0.3, what is P(not A)?",
        options: ["0.3", "0.5", "0.7", "1"],
        correctAnswer: 2,
    },
    {
        chapterId: "statistics",
        questionText: "What is the range of: 5, 12, 3, 8, 15?",
        options: ["10", "12", "15", "3"],
        correctAnswer: 1,
    },
];
