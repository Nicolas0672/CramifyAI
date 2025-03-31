const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  
  export const courseOutline = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Generate a detailed study material for the course. The topic is \"calc\", the course type is \"study\", the difficulty level is \"easy\", and the course layout is \"anti derivative\". \n\n1. **Introduction**: Provide a brief and clear introduction to the course topic \"${topic}\", explaining what learners can expect and why it’s relevant to their learning goals.\n\n2. **Chapter Breakdown**: Break down the course into chapters based on the provided course layout (\"${courseLayout}\" as a guide. If unclear, you can skip). For each chapter, provide:\n   - **Chapter Title**: A descriptive title for the chapter.\n   - **Chapter Summary**: A brief summary of the chapter, outlining the key concepts and objectives that will be covered.\n   - **Topic List**: A detailed list of topics that will be covered in this chapter, with a brief explanation of each topic.\n   - **Learning Objectives**: Include specific learning objectives for each chapter, so that learners can easily track what they are expected to learn.\n\n3. **Content Quality**: Ensure the content is clear, concise, and aligned with the difficulty level of \"${difficultyLevel}\". Provide relevant examples, and if possible, practical applications that enhance understanding. Make sure the material generated is relevant to the topics within the provided course layout, focusing on user interests and key areas of study.\n\n4. **Output in JSON Format**: Output the entire study material in a well-structured JSON format. Each chapter should be an object with the following keys: \"title\", \"summary\", \"topics\", and \"learningObjectives\". Each topic should have a brief explanation of what it covers.\n\nPlease output in the following JSON structure:\n\n{\n  \"courseTitle\": \"Course Title Here\",\n  \"courseType\": \"${courseType}\",\n  \"difficultyLevel\": \"${difficultyLevel}\",\n  \"courseLayout\": \"${courseLayout}\",\n  \"chapters\": [\n    {\n      \"title\": \"Chapter 1: Introduction to ${topic}\",\n      \"summary\": \"Brief description of what the chapter covers.\",\n      \"topics\": [\n        {\n          \"topicName\": \"Topic 1\",\n          \"description\": \"Detailed description of Topic 1\"\n        },\n        {\n          \"topicName\": \"Topic 2\",\n          \"description\": \"Detailed description of Topic 2\"\n        }\n      ],\n      \"learningObjectives\": [\n        \"Objective 1\",\n        \"Objective 2\"\n      ]\n    }\n  ]\n}"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"courseTitle\": \"Introduction to Antiderivatives\",\n  \"courseType\": \"study\",\n  \"difficultyLevel\": \"easy\",\n  \"courseLayout\": \"anti derivative\",\n  \"chapters\": [\n    {\n      \"title\": \"Chapter 1: Understanding the Antiderivative Concept\",\n      \"summary\": \"This chapter introduces the fundamental concept of antiderivatives, also known as indefinite integrals. You will learn what an antiderivative is, its relationship to the derivative, and how to find basic antiderivatives.\",\n      \"topics\": [\n        {\n          \"topicName\": \"What is an Antiderivative?\",\n          \"description\": \"An antiderivative of a function f(x) is a function F(x) whose derivative is f(x), i.e., F'(x) = f(x). We explore the concept with simple examples.\"\n        },\n        {\n          \"topicName\": \"The Indefinite Integral\",\n          \"description\": \"The indefinite integral is the general form of the antiderivative, represented by the symbol ∫. We will see how to represent the antiderivative of f(x) using the indefinite integral ∫f(x) dx.\"\n        },\n        {\n          \"topicName\": \"The Constant of Integration\",\n          \"description\": \"Since the derivative of a constant is zero, the antiderivative of a function is not unique. We always add a constant 'C' to the antiderivative, called the constant of integration, representing all possible antiderivatives.  We explore why this is necessary and how it affects our solutions.\"\n        },\n        {\n          \"topicName\": \"Basic Antiderivative Rules\",\n          \"description\": \"Introduction to simple rules for finding antiderivatives of common functions, like x^n, sin(x), cos(x), and e^x.\"\n        }\n      ],\n      \"learningObjectives\": [\n        \"Define an antiderivative and its relationship to the derivative.\",\n        \"Understand and use the indefinite integral notation.\",\n        \"Explain the importance of the constant of integration.\",\n        \"Apply basic antiderivative rules to find antiderivatives of simple functions.\"\n      ]\n    },\n    {\n      \"title\": \"Chapter 2: Basic Integration Techniques\",\n      \"summary\": \"This chapter builds upon the basics by introducing techniques for finding antiderivatives of more complex functions, including the power rule, constant multiple rule, and sum/difference rule.\",\n      \"topics\": [\n        {\n          \"topicName\": \"The Power Rule for Integration\",\n          \"description\": \"This is one of the most fundamental integration rules. It states that ∫x^n dx = (x^(n+1))/(n+1) + C, provided n ≠ -1. Examples and practice problems will be given.\"\n        },\n        {\n          \"topicName\": \"The Constant Multiple Rule\",\n          \"description\": \"This rule states that ∫k*f(x) dx = k∫f(x) dx, where k is a constant.  We'll learn how to pull constants out of integrals to simplify the process.\"\n        },\n        {\n          \"topicName\": \"The Sum and Difference Rule\",\n          \"description\": \"This rule states that ∫[f(x) ± g(x)] dx = ∫f(x) dx ± ∫g(x) dx. It allows us to break down integrals of sums and differences into simpler integrals.\"\n        },\n        {\n          \"topicName\": \"Antiderivatives of Trigonometric Functions\",\n          \"description\": \"Review of derivatives of sin(x), cos(x), tan(x), etc., and then finding the corresponding antiderivatives: ∫sin(x) dx, ∫cos(x) dx, etc. We will focus on basic trigonometric functions.\"\n        },\n        {\n           \"topicName\": \"Antiderivatives of Exponential Functions\",\n           \"description\": \"The antiderivative of e^x is simply e^x + C.  We also cover cases like ∫a^x dx.\"\n        }\n      ],\n      \"learningObjectives\": [\n        \"Apply the power rule to find antiderivatives of polynomial functions.\",\n        \"Use the constant multiple rule to simplify integration.\",\n        \"Apply the sum and difference rule to integrate more complex functions.\",\n        \"Find antiderivatives of basic trigonometric functions (sin(x) and cos(x)).\",\n        \"Calculate the antiderivatives of exponential functions.\"\n      ]\n    },\n    {\n      \"title\": \"Chapter 3: Applying Antiderivatives - Initial Value Problems\",\n      \"summary\": \"This chapter focuses on using antiderivatives to solve initial value problems. These problems provide additional information that allows us to determine the specific constant of integration and find a unique solution.\",\n      \"topics\": [\n        {\n          \"topicName\": \"What is an Initial Value Problem?\",\n          \"description\": \"An initial value problem involves finding a function given its derivative and a specific value of the function at a particular point (e.g., f'(x) and f(0) = 5).\"\n        },\n        {\n          \"topicName\": \"Solving Initial Value Problems\",\n          \"description\": \"We will learn the steps to solve initial value problems: find the general antiderivative, use the initial condition to solve for the constant of integration, and write the specific solution.\"\n        },\n        {\n          \"topicName\": \"Applications of Initial Value Problems\",\n          \"description\": \"Examples of real-world applications where initial value problems are used, such as finding the position of an object given its velocity and initial position.\"\n        }\n      ],\n      \"learningObjectives\": [\n        \"Define an initial value problem.\",\n        \"Solve initial value problems by finding the general antiderivative and using the initial condition.\",\n        \"Apply antiderivatives to solve real-world problems involving initial values.\"\n      ]\n    },\n    {\n     \"title\": \"Chapter 4: Practice Problems and Review\",\n     \"summary\": \"This chapter is dedicated to practice problems that reinforce all of the concepts learned in the previous chapters. It will include a review of key rules and techniques.\",\n     \"topics\": [\n       {\n         \"topicName\": \"Practice Problems: Basic Antiderivatives\",\n         \"description\": \"A set of problems focusing on applying basic antiderivative rules, the power rule, and the constant multiple rule.\"\n       },\n       {\n         \"topicName\": \"Practice Problems: Trigonometric and Exponential Antiderivatives\",\n         \"description\": \"Problems involving finding antiderivatives of trigonometric and exponential functions.\"\n       },\n       {\n         \"topicName\": \"Practice Problems: Initial Value Problems\",\n         \"description\": \"A collection of initial value problems to solve, incorporating the concepts of antiderivatives and initial conditions.\"\n       },\n       {\n         \"topicName\": \"Review of Key Concepts\",\n         \"description\": \"A summary of the main rules and techniques covered in the course, serving as a refresher for the final assessment.\"\n       }\n     ],\n     \"learningObjectives\":[\n       \"Reinforce understanding of antiderivative rules through practice.\",\n       \"Improve problem-solving skills in applying antiderivatives.\",\n       \"Consolidate knowledge and prepare for assessments.\"\n     ]\n    }\n  ]\n}\n```"},
        ],
      },
    ],
})

export const generateNotesAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate exam material detail content for each chapter, make sure to include all topic point in the content, make sure to give content in HTML format (Do not Add HTMLK, Head, Body, title tag). The chapter {\n      \"title\": \"Chapter 1: Getting Started with JavaScript\",\n      \"summary\": \"This chapter introduces JavaScript, its importance in web development, and what you'll learn in this course. You'll set up your development environment and write your first JavaScript code.\",\n      \"topics\": [\n        \"What is JavaScript and Why Learn It?\",\n        \"Setting Up Your Development Environment\"\n      ]\n    },\n    {"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```html\n    <h2>Chapter 1: Getting Started with JavaScript</h2>\n    <p><strong>Summary:</strong> This chapter introduces JavaScript, its importance in web development, and what you'll learn in this course. You'll set up your development environment and write your first JavaScript code.</p>\n\n    <h3>Topics:</h3>\n    <h4>1. What is JavaScript and Why Learn It?</h4>\n    <ul>\n        <li><strong>Definition of JavaScript:</strong>\n            <ul>\n                <li>Explain what JavaScript is: a high-level, interpreted programming language.</li>\n                <li>Describe JavaScript's original purpose (adding interactivity to web pages).</li>\n                <li>Explain that JavaScript is now used for front-end, back-end, and mobile development.</li>\n            </ul>\n        </li>\n        <li><strong>Importance of JavaScript in Web Development:</strong>\n            <ul>\n                <li>Discuss JavaScript's role in creating dynamic and interactive web pages.</li>\n                <li>Highlight its use in front-end frameworks and libraries (e.g., React, Angular, Vue.js).</li>\n                <li>Mention its use in back-end development with Node.js.</li>\n            </ul>\n        </li>\n        <li><strong>Benefits of Learning JavaScript:</strong>\n            <ul>\n                <li>Explain the high demand for JavaScript developers.</li>\n                <li>Discuss the versatility of JavaScript (front-end, back-end, mobile).</li>\n                <li>Highlight the large and active JavaScript community and extensive resources available.</li>\n            </ul>\n        </li>\n        <li><strong>JavaScript vs. Other Languages (Brief Overview):</strong>\n            <ul>\n                <li>Briefly differentiate JavaScript from HTML (structure) and CSS (styling).</li>\n                <li>Explain that JavaScript adds behavior and interactivity.</li>\n            </ul>\n        </li>\n    </ul>\n\n    <h4>2. Setting Up Your Development Environment</h4>\n    <ul>\n        <li><strong>Text Editors/IDEs:</strong>\n            <ul>\n                <li>Define what a text editor and IDE are.</li>\n                <li>List popular text editors (e.g., VS Code, Sublime Text, Atom) and IDEs (e.g., WebStorm).</li>\n                <li>Discuss the features of a good text editor/IDE (e.g., syntax highlighting, code completion, debugging).</li>\n            </ul>\n        </li>\n        <li><strong>Web Browsers and Developer Tools:</strong>\n            <ul>\n                <li>Explain the role of web browsers in running JavaScript code.</li>\n                <li>Introduce browser developer tools (e.g., Chrome DevTools, Firefox Developer Tools).</li>\n                <li>Show how to access the console for debugging and logging.</li>\n            </ul>\n        </li>\n        <li><strong>Writing Your First JavaScript Code:</strong>\n            <ul>\n                <li>Explain different ways to include JavaScript in HTML:\n                    <ul>\n                        <li>Inline (within HTML tags) - Explain why this is generally not recommended.</li>\n                        <li>Internal (within `<script>` tags in the HTML document).</li>\n                        <li>External (linking a separate `.js` file).  Emphasize this as best practice.</li>\n                    </ul>\n                </li>\n                <li>Write a simple \"Hello, World!\" program using `console.log()`.</li>\n                <li>Explain how to run the code in a web browser.</li>\n            </ul>\n        </li>\n        <li><strong>Basic Syntax and Structure:</strong>\n            <ul>\n                <li>Briefly introduce basic JavaScript syntax elements: statements, variables, comments.</li>\n                <li>Explain the importance of semicolons.</li>\n                <li>Illustrate how to write single-line and multi-line comments.</li>\n            </ul>\n        </li>\n    </ul>\n```"},
      ],
    },
  ],
});
  
export const GenerateFlashCardAI = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate the flashcard on topic: Flutter Fundementals. user interface and basic app navigation in JSON format with front back content. max 10\n"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n[\n  {\n    \"front\": \"What is Flutter?\",\n    \"back\": \"Flutter is a cross-platform UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.\"\n  },\n  {\n    \"front\": \"What is a Widget in Flutter?\",\n    \"back\": \"A Widget is the basic building block of Flutter's UI. Everything you see on screen is a widget (text, buttons, layouts).\"\n  },\n  {\n    \"front\": \"Differentiate between Stateful and Stateless Widgets.\",\n    \"back\": \"StatelessWidgets are immutable; their properties cannot change after they are created.  StatefulWidgets maintain state that can change during the lifetime of the widget.\"\n  },\n  {\n    \"front\": \"What is the `build()` method used for?\",\n    \"back\": \"The `build()` method is the most important method of a widget. It describes the part of the user interface represented by the widget.\"\n  },\n  {\n    \"front\": \"What is the purpose of `MaterialApp` Widget?\",\n    \"back\": \"`MaterialApp` is the root widget for applications that use Material Design. It sets up the theme, home route, and navigation.\"\n  },\n  {\n    \"front\": \"How do you implement navigation between screens in Flutter?\",\n    \"back\": \"Using `Navigator` widget and its methods like `Navigator.push()` (to push a new route onto the stack) and `Navigator.pop()` (to remove the current route).\"\n  },\n  {\n    \"front\": \"What are `Routes` in Flutter Navigation?\",\n    \"back\": \"Routes are named paths in your application that you can navigate to. They're defined in the `routes` property of the `MaterialApp`.\"\n  },\n  {\n    \"front\": \"What is `Scaffold` Widget?\",\n    \"back\": \"`Scaffold` provides a basic layout structure for an app screen, including an AppBar, body, floating action button, and more. It implements the basic Material Design visual layout structure.\"\n  },\n  {\n    \"front\": \"What is a `Layout` Widget? Give Examples.\",\n    \"back\": \"Layout widgets control the size, position, and arrangement of other widgets. Examples: `Row`, `Column`, `Stack`, `Center`, `Padding`.\"\n  },\n  {\n    \"front\": \"Explain `Hot Reload` in Flutter.\",\n    \"back\": \"Hot Reload allows you to quickly see the effects of your changes without restarting the entire application. It injects the updated code into the running Dart VM.\"\n  }\n]\n```"},
      ],
    },
  ],
})

export const GenerateQuizAiModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Generate quiz on topic: calc 1, Difficulty: Medium and content: chain rule with questions and options along with correct answer in jSON format\n"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"quizTitle\": \"Chain Rule Calculus Quiz (Medium)\",\n  \"questions\": [\n    {\n      \"questionText\": \"Find the derivative of y = sin(3x² + 1).\",\n      \"options\": [\n        \"6x cos(3x² + 1)\",\n        \"cos(3x² + 1)\",\n        \"6x sin(3x² + 1)\",\n        \"-6x cos(3x² + 1)\"\n      ],\n      \"correctAnswer\": \"6x cos(3x² + 1)\"\n    },\n    {\n      \"questionText\": \"If f(x) = (2x + 1)⁵, what is f'(x)?\",\n      \"options\": [\n        \"5(2x + 1)⁴\",\n        \"10(2x + 1)⁴\",\n        \"2(2x + 1)⁴\",\n        \"(2x + 1)⁴\"\n      ],\n      \"correctAnswer\": \"10(2x + 1)⁴\"\n    },\n    {\n      \"questionText\": \"What is the derivative of  y = e^(cos(x))?\",\n      \"options\": [\n        \"e^(cos(x))\",\n        \"-sin(x) * e^(cos(x))\",\n        \"sin(x) * e^(cos(x))\",\n        \"-e^(sin(x))\"\n      ],\n      \"correctAnswer\": \"-sin(x) * e^(cos(x))\"\n    },\n    {\n      \"questionText\": \"Determine dy/dx if y = ln(x³ + 2x).\",\n      \"options\": [\n        \"1/(x³ + 2x)\",\n        \"(3x² + 2) / (x³ + 2x)\",\n        \"3x² + 2\",\n        \"(x³ + 2x) / (3x² + 2)\"\n      ],\n      \"correctAnswer\": \"(3x² + 2) / (x³ + 2x)\"\n    },\n    {\n      \"questionText\": \"Find the derivative of y = √(4x - 1)\",\n      \"options\": [\n        \"4 / (2√(4x - 1))\",\n        \"1 / (2√(4x - 1))\",\n        \"2 / √(4x - 1)\",\n        \"√(4x-1)\"\n      ],\n      \"correctAnswer\": \"4 / (2√(4x - 1))\"\n    },\n    {\n      \"questionText\": \"If y = tan²(x), then dy/dx = ?\",\n      \"options\": [\n        \"2tan(x)\",\n        \"2tan(x)sec²(x)\",\n        \"sec⁴(x)\",\n        \"2sec²(x)\"\n      ],\n      \"correctAnswer\": \"2tan(x)sec²(x)\"\n    },\n    {\n      \"questionText\": \"What is the derivative of f(x) = sin(e^x)?\",\n      \"options\": [\n        \"cos(e^x)\",\n        \"e^x cos(e^x)\",\n        \"-e^x cos(e^x)\",\n        \"e^x sin(e^x)\"\n      ],\n      \"correctAnswer\": \"e^x cos(e^x)\"\n    },\n    {\n      \"questionText\": \"Find the derivative of y = (x² + 3)^(3/2)\",\n      \"options\": [\n        \"3x√(x² + 3)\",\n        \"(3/2)(x² + 3)^(1/2)\",\n        \"(3/2)(2x)\",\n        \"3x(x² + 3)^(1/2)\"\n      ],\n      \"correctAnswer\": \"3x√(x² + 3)\"\n    },\n        {\n      \"questionText\": \"Find the derivative of y = cos(sin(x))\",\n      \"options\": [\n        \"-sin(cos(x))\",\n        \"-sin(x)sin(cos(x))\",\n        \"-cos(x)cos(sin(x))\",\n        \"-sin(x)\"\n      ],\n      \"correctAnswer\": \"-sin(x)sin(cos(x))\"\n    },\n    {\n      \"questionText\": \"What is the derivative of f(x) = 2^(x^2)?\",\n      \"options\": [\n        \"2^(x^2) * ln(2)\",\n        \"x * 2^(x^2)\",\n        \"2x * 2^(x^2) * ln(2)\",\n        \"2x * 2^(x^2)\"\n      ],\n      \"correctAnswer\": \"2x * 2^(x^2) * ln(2)\"\n    }\n  ]\n}\n```"},
      ],
    },
  ]})


    export const GenerateFillBlank = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate 5 **fill-in-the-blank** question based on the given topic. Ensure the question has **only one correct answer**. Provide the correct answer separately.\n\nTopic: ${topic}, ContentType: ${courseLayout}, DifficultyLevel: ${difficultyLevel}\n\nRequirements:\n- Keep the question concise but clear.\n- Ensure only **one** word, phrase, or number is missing.\n- If it's a **math question**, format the question using LaTeX syntax and return it as a **string** that can be rendered with MathJax.\n- The correct answer should also be formatted properly but kept as a plain string.\n\nOutput Format (JSON-compatible):\n{\n  \"question\": \"Solve for x: \\\\( 2x + 3 = 7 \\\\), so \\\\( x = \\\\) ____\",\n  \"answer\": \"2\"\n}\n`;"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand. I will generate 5 fill-in-the-blank questions based on your specified topic, content type, and difficulty level, following all the requirements.\n\n```json\n[\n  {\n    \"question\": \"Topic: Photosynthesis, ContentType: Definition, DifficultyLevel: Easy - Photosynthesis is the process by which plants convert light energy into _______ energy.\",\n    \"answer\": \"chemical\"\n  },\n  {\n    \"question\": \"Topic: Cell Biology, ContentType: Cell Structure, DifficultyLevel: Medium - The powerhouse of the cell, responsible for generating ATP, is the ________.\",\n    \"answer\": \"mitochondria\"\n  },\n  {\n    \"question\": \"Topic: Genetics, ContentType: Mendelian Genetics, DifficultyLevel: Medium - If a heterozygous tall plant (Tt) is crossed with a homozygous dwarf plant (tt), the probability of offspring being dwarf is ____ %.\",\n    \"answer\": \"50\"\n  },\n  {\n    \"question\": \"Topic: Ecology, ContentType: Food Webs, DifficultyLevel: Medium - In a food web, organisms that eat only plants are called ________.\",\n    \"answer\": \"herbivores\"\n  },\n  {\n    \"question\": \"question\": \"Topic: Evolution, ContentType: Natural Selection, DifficultyLevel: Hard -  The process by which organisms better adapted to their environment tend to survive and reproduce more successfully is called natural ________.\",\n    \"answer\": \"selection\"\n  }\n]\n```"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "try with math \n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I will generate 5 fill-in-the-blank math questions, following all the requirements.\n\n```json\n[\n  {\n    \"question\": \"Topic: Algebra, ContentType: Linear Equations, DifficultyLevel: Easy - Solve for x: \\\\( x + 5 = 12 \\\\), so \\\\( x = \\\\) ____\",\n    \"answer\": \"7\"\n  },\n  {\n    \"question\": \"Topic: Geometry, ContentType: Area of a Square, DifficultyLevel: Easy - The area of a square with side length 6 is ____.\",\n    \"answer\": \"36\"\n  },\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium - If \\\\( f(x) = x^2 \\\\), then \\\\( f'(x) = \\\\) ____\",\n    \"answer\": \"2x\"\n  },\n  {\n    \"question\": \"Topic: Trigonometry, ContentType: Basic Trig Functions, DifficultyLevel: Medium -  \\\\( sin(π/2) = \\\\) ____\",\n    \"answer\": \"1\"\n  },\n  {\n    \"question\": \"Topic: Number Theory, ContentType: Prime Numbers, DifficultyLevel: Hard - The smallest prime number greater than 20 is ____.\",\n    \"answer\": \"23\"\n  }\n]\n```"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Generate 5 **fill-in-the-blank** question based on the given Topic: ${topic}, ContentType: ${courseLayout}, DifficultyLevel: ${difficultyLevel}. Ensure the question has **only one correct answer**. Provide the correct answer separately.\n\n\n\nRequirements:\n- Keep the question concise but clear.\n- Ensure only **one** word, phrase, or number is missing.\n- If it's a **math question**, format the question using LaTeX syntax and return it as a **string** that can be rendered with MathJax.\n- The correct answer should also be formatted properly but kept as a plain string.\n\nOutput Format (JSON-compatible):\n{\n  \"question\": \"Solve for x: \\\\( 2x + 3 = 7 \\\\), so \\\\( x = \\\\) ____\",\n  \"answer\": \"2\"\n}\n`;"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I'm ready. Please provide the following values:\n\n*   **topic:** (e.g., Chemistry, History, Literature, etc.)\n*   **courseLayout:** (e.g., Atomic Structure, World War II, Shakespearean Plays, etc.)\n*   **difficultyLevel:** (e.g., Easy, Medium, Hard)\n\nOnce you provide these, I will generate the JSON output with 5 fill-in-the-blank questions.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Generate 5 **fill-in-the-blank** question based on the given Topic: ${calc}, ContentType: ${derive}, DifficultyLevel: ${medium\n}. Ensure the question has **only one correct answer**. Provide the correct answer separately.\n\n\n\nRequirements:\n- Keep the question concise but clear.\n- Ensure only **one** word, phrase, or number is missing.\n- If it's a **math question**, format the question using LaTeX syntax and return it as a **string** that can be rendered with MathJax.\n- The correct answer should also be formatted properly but kept as a plain string.\n\nOutput Format (JSON-compatible):\n{\n  \"question\": \"Solve for x: \\\\( 2x + 3 = 7 \\\\), so \\\\( x = \\\\) ____\",\n  \"answer\": \"2\"\n}\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I'll assume the missing values are as follows:\n\n*   **topic:** Calculus\n*   **courseLayout:** Derivatives\n*   **difficultyLevel:** Medium\n\nHere are 5 fill-in-the-blank questions based on those assumptions:\n\n```json\n[\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium -  If \\\\( f(x) = x^3 \\\\), then \\\\( f'(x) = \\\\) ____\",\n    \"answer\": \"3x^2\"\n  },\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium -  The derivative of a constant is always ____.\",\n    \"answer\": \"0\"\n  },\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium -  If \\\\( f(x) = sin(x) \\\\), then \\\\( f'(x) = \\\\) ____\",\n    \"answer\": \"cos(x)\"\n  },\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium - \\\\( \\\\frac{d}{dx} (5x^2 + 2x - 1) = \\\\) ____\",\n    \"answer\": \"10x + 2\"\n  },\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium -  If \\\\( f(x) = e^x \\\\), then \\\\( f'(x) = \\\\) ____\",\n    \"answer\": \"e^x\"\n  }\n]\n```\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Generate 5 **fill-in-the-blank** question based on the given Topic: ${topic}, ContentType: ${courseLayout}, DifficultyLevel: ${difficultyLevel}. Ensure the question has **only one correct answer**. Provide the correct answer separately.\n\n\n\nRequirements:\n- Keep the question concise but clear.\n- Ensure only **one** word, phrase, or number is missing.\n- If it's a **math question**, format the question using LaTeX syntax and return it as a **string** that can be rendered with MathJax.\n- The correct answer should also be formatted properly but kept as a plain string.\n\nMake SURE TO  Output  THIS  Format (JSON-compatible):\n{\n  \"question\": \"Solve for x: \\\\( 2x + 3 = 7 \\\\), so \\\\( x = \\\\) ____\",\n  \"answer\": \"2\"\n}\n`;"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "I understand. To generate the questions, I need you to provide the following:\n\n*   **topic:** (e.g., Chemistry, History, Literature, etc.)\n*   **courseLayout:** (e.g., Atomic Structure, World War II, Shakespearean Plays, etc.)\n*   **difficultyLevel:** (e.g., Easy, Medium, Hard)\n\nOnce you provide these values, I will create the JSON output with 5 fill-in-the-blank questions in the exact format you specified. I'm waiting for your input!\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Generate 5 fill-in-the-blank question based on the given Topic: ${calc}, ContentType: ${derive}, DifficultyLevel: ${medium\n}. Ensure the question has only one correct answer. Provide the correct answer separately.\n\nRequirements:\n\nKeep the question concise but clear.\n\nEnsure only one word, phrase, or number is missing.\n\nIf it's a math question, format the question using LaTeX syntax and return it as a string that can be rendered with MathJax.\n\nThe correct answer should also be formatted properly but kept as a plain string.\n\nMake SURE TO  Output  THIS  Format (JSON-compatible):\n{\n\"question\": \"Solve for x: \n2\nx\n+\n3\n=\n7\n2x+3=7\n, so \nx\n=\nx=\n ____\",\n\"answer\": \"2\"\n}"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "You've provided the Topic, ContentType and DifficultyLevel as `${calc}`, `${derive}` and `${medium}` respectively. However, those are placeholders and I need actual values to create the questions. I'll assume you meant:\n\n*   **Topic:** Calculus\n*   **ContentType:** Derivatives\n*   **DifficultyLevel:** Medium\n\nBased on these assumptions, here are 5 fill-in-the-blank questions in the requested JSON format:\n\n```json\n[\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium - If \\\\( f(x) = 4x^3 \\\\), then \\\\( f'(x) = \\\\) ____\",\n    \"answer\": \"12x^2\"\n  },\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium - The derivative of \\\\( x \\\\) with respect to \\\\( x \\\\) is ____.\",\n    \"answer\": \"1\"\n  },\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium - If \\\\( f(x) = cos(x) \\\\), then \\\\( f'(x) = \\\\) ____\",\n    \"answer\": \"-sin(x)\"\n  },\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium - \\\\( \\\\frac{d}{dx} (x^4 - 3x^2 + 6) = \\\\) ____\",\n    \"answer\": \"4x^3 - 6x\"\n  },\n  {\n    \"question\": \"Topic: Calculus, ContentType: Derivatives, DifficultyLevel: Medium - If \\\\( f(x) = ln(x) \\\\), then \\\\( f'(x) = \\\\) ____\",\n    \"answer\": \"\\\\frac{1}{x}\"\n  }\n]\n```\n"},
          ],
        },
      ],
    });

    export const GenerateStartExam = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "const prompt = `Pretend you are a teacher giving a student an exam. Generate a randomized question based on the following parameters:\n\n- Topic: ${calc}\n- Course Layout: ${chain rule}\n- Difficulty Level: ${hard}\n- Time to complete the question: ${30} minutes\n\nThe question should require a **long or short answer** (no multiple choices). The generated question should be challenging yet appropriate for the specified difficulty level, and it should be able to be answered within the given time.\n\nFor **math-related questions**:\n- Ensure the problem involves solving an equation, performing calculations, or explaining mathematical concepts. \n- Only provide **one answer** unless the question is designed to check the student’s understanding of the process (e.g., if asking about the steps involved, then include steps).\n- Avoid dragging the answer out—if it requires a single answer, provide it concisely.\n\nFor rendering math equations, output the question and answer using **LaTeX format**:\n- Use `$ ... $` for inline math.\n- Use `$$ ... $$` for display math.\n\nFor example:\n\n{\n  \"question\": \"What is the derivative of the function $f(x) = 3x^2 + 5x$?\",\n  \"answer\": \"The derivative of $f(x) = 3x^2 + 5x$ is $f'(x) = 6x + 5$.\"\n}\n`\n\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"question\": \"A particle's position in space is given by the vector function $\\\\mathbf{r}(t) = \\\\langle \\\\cos(t^2), \\\\sin(t^2), t \\\\rangle$.  Find the magnitude of the particle's acceleration vector at time $t = \\\\sqrt{\\\\frac{\\\\pi}{2}}$. Show all steps.\",\n  \"answer\": \"First, we find the velocity vector $\\\\mathbf{v}(t)$ by taking the derivative of the position vector $\\\\mathbf{r}(t)$ with respect to time $t$:\\n\\n$$\\\\mathbf{v}(t) = \\\\frac{d\\\\mathbf{r}}{dt} = \\\\langle -2t\\\\sin(t^2), 2t\\\\cos(t^2), 1 \\\\rangle$$\\n\\nNext, we find the acceleration vector $\\\\mathbf{a}(t)$ by taking the derivative of the velocity vector $\\\\mathbf{v}(t)$ with respect to time $t$:\\n\\n$$\\\\mathbf{a}(t) = \\\\frac{d\\\\mathbf{v}}{dt} = \\\\langle -2\\\\sin(t^2) - 4t^2\\\\cos(t^2), 2\\\\cos(t^2) - 4t^2\\\\sin(t^2), 0 \\\\rangle$$\\n\\nNow, we evaluate the acceleration vector at $t = \\\\sqrt{\\\\frac{\\\\pi}{2}}$:\\n\\n$$\\\\mathbf{a}\\\\left(\\\\sqrt{\\\\frac{\\\\pi}{2}}\\\\right) = \\\\langle -2\\\\sin\\\\left(\\\\frac{\\\\pi}{2}\\\\right) - 4\\\\left(\\\\frac{\\\\pi}{2}\\\\right)\\\\cos\\\\left(\\\\frac{\\\\pi}{2}\\\\right), 2\\\\cos\\\\left(\\\\frac{\\\\pi}{2}\\\\right) - 4\\\\left(\\\\frac{\\\\pi}{2}\\\\right)\\\\sin\\\\left(\\\\frac{\\\\pi}{2}\\\\right), 0 \\\\rangle$$\\n\\n$$\\\\mathbf{a}\\\\left(\\\\sqrt{\\\\frac{\\\\pi}{2}}\\\\right) = \\\\langle -2(1) - 2\\\\pi(0), 2(0) - 2\\\\pi(1), 0 \\\\rangle = \\\\langle -2, -2\\\\pi, 0 \\\\rangle$$\\n\\nFinally, we find the magnitude of the acceleration vector at $t = \\\\sqrt{\\\\frac{\\\\pi}{2}}$:\\n\\n$$|\\\\mathbf{a}| = \\\\sqrt{(-2)^2 + (-2\\\\pi)^2 + 0^2} = \\\\sqrt{4 + 4\\\\pi^2} = \\\\sqrt{4(1 + \\\\pi^2)} = 2\\\\sqrt{1 + \\\\pi^2}$$\\n\\nTherefore, the magnitude of the particle's acceleration vector at time $t = \\\\sqrt{\\\\frac{\\\\pi}{2}}$ is $2\\\\sqrt{1 + \\\\pi^2}$.\"\n}\n```"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "const prompt = `Pretend that you are a teacher giving a student an exam. Generate a randomized question based on the following parameters:\n\n- Topic: ${calc}\n- Course Layout: ${chain rule}\n- Difficulty Level: ${hard}\n- Time to complete the question: 5 minutes\n\nThe question should require a **short or long answer** (no multiple choices) and should challenge the student but be solvable within 5 minutes. Only the final answer is required (no steps or intermediate reasoning needed).\n\nFor **math-related questions**:\n- Provide the complete problem without breaking it into steps.\n- Ensure that the answer is the final result, and use LaTeX formatting for rendering.\n\nExample:\n\n{\n  \"question\": \"A particle's position in space is given by the vector function $\\\\mathbf{r}(t) = \\\\langle \\\\cos(t^2), \\\\sin(t^2), t \\\\rangle$. Find the magnitude of the particle's acceleration vector at time $t = \\\\sqrt{\\\\frac{\\\\pi}{2}}$.\",\n  \"answer\": \"2\\\\sqrt{1 + \\\\pi^2}\"\n}\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"question\": \"Find $\\\\frac{dy}{dx}$ if $y = \\\\sin(\\\\tan(\\\\sqrt{x}))$.\",\n  \"answer\": \"\\\\frac{\\\\sec^2(\\\\sqrt{x}) \\\\cdot \\\\cos(\\\\tan(\\\\sqrt{x}))}{2\\\\sqrt{x}}\"\n}\n```"},
          ],
        },
      ],
    });

    export const GenerateNextQuestion = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "const prompt = `\nBased on the student's answer: \"${5}\", the correct answer: \"${3}\", the difficulty level: \"${difficultyLevel}\", and the question: \"${5-2}\", please assume the role of a professional educator dynamically grading the student's response.\n\n1. Provide a numerical rating (out of 10) for the student's answer.\n2. Offer a concise but thorough explanation of the student's response, indicating areas where they performed well and where they could improve.\n3. If the student's answer contains mathematical content, ensure that the explanation includes proper LaTeX formatting for equations (e.g., $f(x) = (2x + 1)^5$) for clarity.\n4. Point out any mistakes and offer actionable steps for the student to improve their understanding and approach.\n5. Finally, generate a new question tailored to the student's strengths and weaknesses, adjusting the difficulty to either reinforce or challenge their learning as needed.\n\nPlease structure the response as a JSON object with the following fields:\n\n{\n  \n  \"feedback\": {\n    \"rating\": \"Numerical rating for the student's answer (out of 10)\",\n    \"explanation\": \"A thorough explanation of the student's response, including the correct mathematical steps and proper LaTeX formatting if necessary\",\n    \"strengths\": \"The student's strengths in this particular problem\",\n    \"weaknesses\": \"Any mistakes or areas where the student can improve\",\n    \"improvementSuggestions\": \"Suggestions to help the student improve their understanding\",\n    \"question\": \"A new question generated based on the student's performance\"\n  }\n}\n\nPlease ensure the response is clear, professional, and instructional, providing not just the feedback but also opportunities for further improvement.\n`;\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"feedback\": {\n    \"rating\": \"2\",\n    \"explanation\": \"The student answered 5 to the question 5-2. The correct answer is 3. The student clearly didn't understand the subtraction operation. 5 - 2 means taking away 2 from 5.  This can be visually represented or counted out to aid understanding.  The student seems to have added instead of subtracted.\",\n    \"strengths\": \"None evident in this response. Potentially, the student understands basic number recognition.\",\n    \"weaknesses\": \"Lack of understanding of subtraction. Confusion between addition and subtraction.\",\n    \"improvementSuggestions\": \"1. **Review Subtraction Basics:**  Use concrete objects (like blocks or fingers) to demonstrate subtraction. Start with simple examples and gradually increase complexity.  For example, show 5 blocks, then remove 2 and count how many are left. 2. **Visual Aids:**  Use number lines or pictures to represent subtraction problems.  For 5 - 2, start at 5 on the number line and move 2 spaces to the left. 3. **Practice with Flashcards:**  Create flashcards with simple subtraction problems.  4. **Relate to Real-Life Scenarios:**  Present subtraction in relatable scenarios, such as 'You have 5 candies and give away 2. How many do you have left?'\",\n    \"question\": \"You have 4 apples and eat 1. How many apples do you have left?\"\n  }\n}\n```"},
          ],
        },
      ],
    });

    export const GenerateTeachQuestions = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "imagine you are new to the concept and want to learn, create 5 question to ask user based on difficulty level 'easy' role''student' amount:5 courseLayout: chainRule in json format\n\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, here are five questions about the Chain Rule, designed for a student finding the concept challenging, and presented in order of increasing difficulty (Hard Difficulty):\n\n```json\n{\n  \"courseLayout\": \"chainRule\",\n  \"questions\": [\n    {\n      \"question_number\": 1,\n      \"difficulty\": \"Hard\",\n      \"question_text\": \"Explain, in your own words, *why* the chain rule is necessary when differentiating composite functions.  Focus on the rate of change concept.  Why can't we simply differentiate the outer and inner functions separately and multiply the results?\",\n      \"type\": \"Conceptual Understanding\",\n      \"expected_answer_type\": \"Explanation\",\n      \"hints\": [\n        \"Think about how a small change in 'x' affects the inner function, and then how *that change* affects the outer function.\",\n        \"Consider an analogy, like gears turning. One gear's speed affects the next.\"\n      ]\n    },\n    {\n      \"question_number\": 2,\n      \"difficulty\": \"Hard\",\n      \"question_text\": \"Let's say you have y = f(g(h(x))), a composite function with three nested functions.  Generalize the chain rule to find dy/dx. Show the breakdown into multiple derivatives.\",\n      \"type\": \"Generalization & Application\",\n      \"expected_answer_type\": \"Formula Derivation\",\n      \"hints\": [\n        \"Think about applying the chain rule multiple times, working from the outermost function inwards.\",\n        \"Consider using u = g(h(x)) to simplify initially, then applying the chain rule again.\"\n      ]\n    },\n    {\n      \"question_number\": 3,\n      \"difficulty\": \"Hard\",\n      \"question_text\": \"Imagine the derivative of a function f(x) at x=2 is f'(2)=5 and g(2)=2 and g'(2)=3.  Also, you know the derivative of a second function, h(x)=f(g(x)) . What is the value of h'(2)? Explain each step.\",\n      \"type\": \"Application with Given Values\",\n      \"expected_answer_type\": \"Numerical Answer with Justification\",\n      \"hints\": [\n        \"Write out the chain rule for h'(x) = (d/dx) f(g(x)).\",\n        \"Substitute g(2) for the inner function where necessary.\",\n\t\"What values do you have that you will need to replace in your equation?\"\n      ]\n    },\n    {\n      \"question_number\": 4,\n      \"difficulty\": \"Hard\",\n      \"question_text\": \"The function f(x) = x^3 + 1 is invertible. Let g(x) be its inverse. Find g'(2) using the chain rule, *without* explicitly finding the formula for g(x). (Hint: use the fact that f(g(x)) = x).\",\n      \"type\": \"Application with Inverse Functions\",\n      \"expected_answer_type\": \"Numerical Answer with Justification\",\n      \"hints\": [\n        \"Differentiate both sides of the equation f(g(x)) = x with respect to x.\",\n        \"What is the derivative of x with respect to x?\",\n        \"Solve for g'(x) in terms of f'(g(x)).\",\n        \"You need to find the value of x such that f(x) = 2 and thus g(2) = x.\"\n      ]\n    },\n    {\n      \"question_number\": 5,\n      \"difficulty\": \"Hard\",\n      \"question_text\": \"Suppose you have a function z = f(x, y) where x = g(t) and y = h(t). This describes a curve in 3D space. Derive the formula for dz/dt using the chain rule. Explain your reasoning for each term in the formula and why you need partial derivatives.\",\n      \"type\": \"Multivariable Calculus Extension\",\n      \"expected_answer_type\": \"Formula Derivation with Explanation\",\n      \"hints\": [\n        \"z is ultimately a function of t.\",\n        \"How does a change in 't' affect 'x' and 'y'?\",\n        \"How do changes in 'x' and 'y' affect 'z'?\",\n        \"Think of the total derivative of z with respect to t as the sum of the influences from x and y.\",\n        \"Partial derivatives are needed because z depends on both x and y independently.\"\n      ]\n    }\n  ]\n}\n```\n\n**Explanation of the questions and why they are considered \"Hard\" for a new learner:**\n\n*   **Question 1 (Conceptual Understanding):** This goes beyond just applying the formula. It requires a deep understanding of the *why* behind the chain rule and the concept of rates of change. Many students struggle with the conceptual foundation.\n*   **Question 2 (Generalization & Application):** Extending the chain rule to a three-level composite function requires abstract thinking and generalizing the pattern.\n*   **Question 3 (Application with Given Values):** Requires carefully applying the Chain Rule formula while keeping track of the given information, and substituting correctly. The student must understand when to substitute *what*.\n*   **Question 4 (Application with Inverse Functions):** This combines the chain rule with the concept of inverse functions. The trick is to use the relationship `f(g(x)) = x` and differentiate *implicitly* – a challenging technique.  Finding g'(2) *without* finding g(x) adds another layer of difficulty.\n*   **Question 5 (Multivariable Calculus Extension):** This introduces the chain rule in a multivariable context, requiring understanding of partial derivatives and how multiple variables influence each other. This is a significant step up in complexity.\n\nThese questions are designed to progressively challenge the student's understanding of the chain rule, forcing them to think critically and apply the concept in various contexts. They also aim to uncover potential misconceptions. Remember to provide constructive feedback and support as the student attempts these problems.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "imagine you are new to the concept and want to learn, create 5 question to ask user based on difficulty level 'easy' role''student' amount:5 courseLayout: chainRule in json format\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, here are five questions about the Chain Rule, designed for a student finding the concept challenging, and presented in order of increasing difficulty (Easy Difficulty):\n\n```json\n{\n  \"courseLayout\": \"chainRule\",\n  \"questions\": [\n    {\n      \"question_number\": 1,\n      \"difficulty\": \"Easy\",\n      \"question_text\": \"Can you give me a simple example of a composite function? A composite function is where one function is 'inside' another.  For example, something like 'square the result of taking the sine of x'.\",\n      \"type\": \"Concept Recognition\",\n      \"expected_answer_type\": \"Example of a Composite Function\",\n      \"hints\": [\n        \"Think about functions like sin(x), cos(x), x^2, sqrt(x), etc.\",\n        \"Try putting one of those functions 'inside' another one. For example sin(x^2) or (sin(x))^2\"\n      ]\n    },\n    {\n      \"question_number\": 2,\n      \"difficulty\": \"Easy\",\n      \"question_text\": \"Let's say we have y = (2x + 1)^2. Can you identify the 'outer' function and the 'inner' function in this expression?\",\n      \"type\": \"Function Identification\",\n      \"expected_answer_type\": \"Identification of Outer and Inner Functions\",\n      \"hints\": [\n        \"What's the *last* thing you would do if you were calculating the value of this function for a specific x?\",\n        \"The inner function is the one that's directly inside the parentheses or other grouping symbols.\"\n      ]\n    },\n    {\n      \"question_number\": 3,\n      \"difficulty\": \"Easy\",\n      \"question_text\": \"The chain rule is used to find the derivative of composite functions.  The formula is often written as dy/dx = (dy/du) * (du/dx).  In your own words, what does each of these parts mean? What does 'dy/du' represent?\",\n      \"type\": \"Formula Explanation\",\n      \"expected_answer_type\": \"Explanation of Derivative Notation\",\n      \"hints\": [\n        \"Think of 'd/dx' as 'the derivative with respect to x'.\",\n        \"If 'u' is a function of x, then 'du/dx' is the derivative of 'u' with respect to x.\",\n\t\"Think of u as the inside function.\"\n      ]\n    },\n    {\n      \"question_number\": 4,\n      \"difficulty\": \"Easy\",\n      \"question_text\": \"Let's use the chain rule on y = sin(x^2).  We can say that u = x^2. What are dy/du and du/dx? (Don't worry about simplifying yet, just find the individual derivatives).\",\n      \"type\": \"Applying Individual Derivatives\",\n      \"expected_answer_type\": \"Finding dy/du and du/dx\",\n      \"hints\": [\n        \"If u = x^2, what's the derivative of u with respect to x (du/dx)?\",\n        \"If y = sin(u), what's the derivative of y with respect to u (dy/du)?\"\n      ]\n    },\n    {\n      \"question_number\": 5,\n      \"difficulty\": \"Easy\",\n      \"question_text\": \"Okay, we know that for y = sin(x^2), dy/du = cos(u) and du/dx = 2x.  Now, put it all together!  Use the chain rule formula dy/dx = (dy/du) * (du/dx) to find dy/dx. Don't forget to substitute back in for 'u'!\",\n      \"type\": \"Putting it All Together\",\n      \"expected_answer_type\": \"Applying Chain Rule with Substitution\",\n      \"hints\": [\n        \"Multiply the expressions you found for dy/du and du/dx.\",\n        \"Remember that 'u' is actually x^2, so replace 'u' with 'x^2' in your final answer.\"\n      ]\n    }\n  ]\n}\n```\n\n**Explanation of the questions and why they are considered \"Easy\" for a new learner:**\n\n*   **Question 1 (Concept Recognition):** Starts with a very basic understanding of what a composite function *is* before diving into the calculus. The goal is to ensure the student has a mental model of what they're working with.\n*   **Question 2 (Function Identification):** Focuses on identifying the 'inner' and 'outer' functions, a key skill for applying the chain rule. This is done with a relatively simple example.\n*   **Question 3 (Formula Explanation):** Requires the student to explain the *meaning* of the different parts of the chain rule formula (dy/du, du/dx) without actually performing any calculations. This reinforces the notation and the underlying idea.\n*   **Question 4 (Applying Individual Derivatives):** Breaks down the chain rule into smaller, more manageable steps. The student finds the derivatives of the inner and outer functions *separately* before combining them.\n*   **Question 5 (Putting it All Together):** Finally, the student puts the pieces together and applies the chain rule formula. Emphasis is placed on substituting back in for 'u' at the end to get the answer in terms of 'x'.\n\nThese questions are designed to build a solid foundation for understanding the chain rule, starting with the basic concept of composite functions and gradually working up to applying the formula in a simple example.  The emphasis is on understanding and breaking down the problem into smaller, more digestible parts.\n"},
          ],
        },
      ],
    });

    export const GenereateTeachFeedback = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "You are an AI tutor evaluating a learning session. Below is a transcript of a student explaining a topic to an AI assistant. Provide feedback on their explanation based on clarity, accuracy, depth, and confidence. Also, suggest two areas for improvement.\n\nTranscript:\n\"\"\"\nYou are an AI feedback generator. Analyze the following transcript of a TeachMe Mode session and provide structured feedback in JSON format.\n\nTranscript:\n{{formattedTranscript}}\n\nReturn the feedback in this JSON format:\n{\n  \"summary\": \"A brief summary of how the session went.\",\n  \"strengths\": [\"List of things the user did well\"],\n  \"improvements\": [\"List of areas for improvement\"],\n  \"overallScore\": \"A score out of 10 based on the quality of explanations\"\n}\n\n\"\"\"\n**Please return in JSON FORMAT\n### Feedback:\n- **Clarity:** (Was the explanation easy to understand?)\n- **Accuracy:** (Did they provide correct information?)\n- **Depth:** (Did they cover the topic in enough detail?)\n- **Confidence:** (Did they sound sure of their answer?)\n- **Suggestions for improvement:** (Give two actionable tips to help them improve.)\n`"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I'm ready to analyze the transcript and provide feedback in JSON format. I'll focus on clarity, accuracy, depth, confidence, and provide two actionable suggestions for improvement. I need the transcript to complete the evaluation.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "- User: The Fibonacci sequence is a series of numbers where each number is the sum of the two previous ones, starting from 0 and 1.  \n- AI: That’s a great start! Can you explain how it's used in real life?  \n- User: Umm... I think it appears in nature, like in the way leaves grow on a plant?  \n- AI: Yes! It’s seen in nature, like in the arrangement of petals. Can you describe how we calculate the 5th Fibonacci number?  \n- User: Oh, I think it’s... 0, 1, 1, 2, 3... So the 5th one is 5?  \n- AI: Almost! The 5th Fibonacci number is actually 3. Keep going, you’re doing great!  \n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"summary\": \"The user provided a basic definition of the Fibonacci sequence and attempted to apply it. While they showed initial understanding, they struggled with applying the definition correctly to calculate a specific Fibonacci number.\",\n  \"strengths\": [\n    \"Successfully defined the Fibonacci sequence in its basic form.\",\n    \"Recognized the sequence's connection to patterns in nature.\",\n    \"Attempted to apply the definition to calculate the 5th Fibonacci number.\"\n  ],\n  \"improvements\": [\n    \"Practice calculating Fibonacci numbers to improve accuracy. Take the time to write out the sequence step-by-step to avoid errors.\",\n    \"Provide more specific examples of the Fibonacci sequence in nature. Instead of just saying it appears in leaves, mention specific examples like the spiral arrangement of seeds in a sunflower or the branching of trees, and try to explain *why* it appears there (optimization of space/resources).\"\n  ],\n  \"overallScore\": \"6\"\n}\n```\n"},
          ],
        },
      ],
    });

    export const GenerateStudyTip = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "generate a study tip in json\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"studyTip\": \"Use the Feynman Technique: Explain the concept you're learning in simple terms, as if you were teaching it to someone with no prior knowledge. Identify gaps in your understanding and revisit the source material. Repeat the process until you can explain the concept clearly and concisely. This helps solidify your understanding and identify areas where you need more focus.\",\n  \"category\": \"Active Learning\",\n  \"tags\": [\"understanding\", \"explanation\", \"simplification\", \"teaching\", \"review\", \"feynman\", \"active recall\"],\n  \"difficulty\": \"Medium\",\n  \"timeInvestment\": \"Variable (depending on concept complexity)\",\n  \"effectiveness\": \"High\"\n}\n```"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "generate a single line of tip for studying in json"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{ \"tip\": \"Break down large tasks into smaller, manageable chunks to avoid feeling overwhelmed.\" }\n```\n"},
          ],
        },
      ],
    });
  
   
