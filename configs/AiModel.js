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
