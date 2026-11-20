using AnindoPortfolio.Models;

namespace AnindoPortfolio.Services;

/// <summary>
/// One place for all the website content.
/// To update the site (new paper, new project, new certificate), edit the lists below.
/// </summary>
public class PortfolioService
{
    public IReadOnlyList<FocusArea> FocusAreas { get; } =
    [
        new("health", "Healthcare prediction", "Predicting disease risk from clinical data",
            "A comparative study for early heart-disease detection (CatBoost 90.76%) and an ongoing maternal-health risk model with SHAP explanations.",
            "→ 2 studies below"),
        new("env", "Environmental monitoring", "Sensing and forecasting the climate",
            "EcoSense, an ESP32/Arduino IoT station accepted at IEEE ICRPSET-2026, and WeatherStation, ML weather forecasts served through a Telegram bot.",
            "→ 1 paper · 1 project"),
        new("cv", "Computer vision", "Next: pattern recognition",
            "Taking Computer Vision & Pattern Recognition next semester as groundwork for an AI/ML thesis.",
            "→ thesis direction"),
        new("llm", "LLMs for SE", "Large language models for software engineering",
            "Exploring how LLMs support software engineering, starting from systematic literature reviews.",
            "→ exploring"),
    ];

    public IReadOnlyList<ResearchPaper> Papers { get; } =
    [
        new("accepted", "Accepted · IEEE", "Sept 2026",
            "EcoSense: IoT-Based Environmental Monitoring Station for Smart Climate Observation",
            "2026 IEEE 9th ICRPSET, University of Rajshahi",
            "with Nishat Tasnim Ema · Supervisor: Md Sajid Hossain",
            "An IoT station that monitors environmental conditions for smart climate observation, built with ESP32/Arduino microcontrollers and environmental sensors.",
            ["IoT", "ESP32", "Arduino", "Sensors"], "Accepted for presentation", null),
        new("revision", "Under revision", "Sept 2026",
            "A Comparative Study of Machine Learning Algorithms for Early Detection of Heart Disease",
            "Manuscript, preparing resubmission",
            "Comparative ML study",
            "Compares Logistic Regression, Random Forest, XGBoost and CatBoost on the UCI Heart Disease and Kaggle datasets.",
            ["CatBoost", "XGBoost", "Random Forest", "LogReg"], "Best: CatBoost 90.76%", "heart-disease"),
        new("ongoing", "Ongoing proposal", "Oct 2026",
            "Maternal Health Risk Prediction Using Optimised and Cross-Validated Machine Learning Classifiers",
            "Machine Learning course, AIUB",
            "with Nishat Tasnim Ema · Supervisor: Sharfuddin Mahmood",
            "KNN, Random Forest, SVM and XGBoost on a 6,103-record maternal health dataset, with hyperparameter tuning, stratified cross-validation and SHAP explainability.",
            ["KNN", "SVM", "XGBoost", "SHAP"], "6,103 records", null),
    ];

    public IReadOnlyList<ModelResult> HeartModels { get; } =
    [
        new("lr", "Logistic Regression", "Linear", 88.59, "A strong, interpretable baseline: tied with Random Forest."),
        new("rf", "Random Forest", "Bagging", 88.59, "Matched the linear baseline on this data."),
        new("xgb", "XGBoost", "Boosting", 89.13, "Gradient boosting added about half a point."),
        new("cat", "CatBoost", "Boosting", 90.76, "Best so far, +2.17 points over the baseline models."),
    ];

    public IReadOnlyList<Project> Projects { get; } =
    [
        new("ML", "WeatherStation", "Python",
            "Separate ML models predict temperature, humidity and rain; a Telegram bot serves forecasts via /weather. Fixed an event-loop block that caused request timeouts.",
            ["Python", "ML models", "Telegram Bot API"], "https://github.com/anindomahmood/WeatherStation"),
        new("ML", "Machine Learning Notebooks", "Colab",
            "Heart-disease prediction, Naive Bayes classification and insurance data analysis worked through in Google Colab.",
            ["Python", "Google Colab", "Naive Bayes"], "https://github.com/anindomahmood/MachineLearning"),
        new("Graphics", "Waves of Cox’s Bazar", "Spring 2025–26",
            "Interactive 2D simulation of the world’s longest natural sea beach: changing weather, landmarks, double-buffered animation and synced audio.",
            ["C++", "OpenGL", "GLUT"], "https://github.com/anindomahmood/Computer-Graphics"),
        new("Web", "WorkPulse", "v1.0.0",
            "Role-based task management with Admin, Manager, Team Leader and Employee modules, authentication and a relational database.",
            ["PHP", "MySQL", "JavaScript"], "https://github.com/anindomahmood/WorkPulse"),
        new("Web", "WayFinder", "v1.0.0",
            "A responsive tourism website for exploring Bangladesh, with home, login and sign-up pages. Built in a team with Git (25 commits).",
            ["HTML5", "CSS3"], "https://github.com/anindomahmood"),
        new(".NET", "HR Management System", "Summer 2024–25",
            "Desktop HR app with a C# interface on a SQL database, structured with encapsulation, inheritance and polymorphism.",
            ["C#", "WinForms", "SQL"], "https://github.com/anindomahmood/OOP2-Projects"),
        new(".NET", "ASP.NET Learning Projects", "MVC",
            "Practice apps covering MVC architecture, Entity Framework data access and a CRUD web app (JokesWebApp).",
            ["C#", "ASP.NET Core", "EF Core"], "https://github.com/anindomahmood/ASP.NET"),
    ];

    public IReadOnlyList<SkillGroup> Skills { get; } =
    [
        new("Languages", ["Python", "C", "C++", "C#", "Java", "JavaScript", "PHP"]),
        new("Machine learning", ["Linear & logistic regression", "Tree ensembles", "SVM", "k-NN", "Azure ML Studio"]),
        new("Web & desktop", ["ASP.NET Core MVC", "Entity Framework", "WinForms", "HTML5", "CSS3", "PHP"]),
        new("Databases", ["MySQL", "SQL Server", "Oracle", "MongoDB"]),
        new("IoT & hardware", ["ESP32", "Arduino", "Sensors", "Proteus", "Tinkercad"]),
        new("Graphics", ["OpenGL", "GLUT"]),
        new("Research tools", ["Google Colab", "Kaggle", "Overleaf (LaTeX)", "Git", "Linux"]),
    ];

    public IReadOnlyList<TimelineItem> Timeline { get; } =
    [
        new("edu", "Sep 2023 – Present", "B.Sc. in CSE (Information Systems)", "American International University-Bangladesh · CGPA 3.51"),
        new("edu", "Aug 2019 – Dec 2021", "Higher Secondary Certificate, Science", "Ishwardi Govt. College, Pabna · GPA 5.00"),
        new("edu", "Jan 2014 – Dec 2018", "Secondary School Certificate, Science", "Govt. Sara Marwari Model School & College · GPA 5.00"),

        new("cert", "Oct 2026", "Python Essentials 1", "Cisco Networking Academy & Python Institute"),
        new("cert", "Oct 2026", "Machine Learning Pipelines with Azure ML Studio", "Coursera project certificate"),
        new("cert", "Oct 2026", "Personal Branding in AI Era", "Grameenphone Academy · Certificate of Excellence"),
        new("cert", "Dec 2023", "IT Essentials: PC Hardware and Software", "Cisco Networking Academy"),

        new("work", "7 Nov 2025", "Getting Started with LaTeX", "Webinar · AIUB Research & Development Club"),
        new("work", "8 Sep 2025", "How to Secure an Erasmus Mundus Scholarship", "Webinar · AIUB R&D Club"),
        new("work", "21 Aug 2025", "From Idea to Paper: Guided Research Writing", "Workshop · AIUB R&D Club"),
        new("work", "9 Jul 2025", "Unlocking Research: A Beginner’s Blueprint", "Webinar · AIUB R&D Club"),
    ];

    public IReadOnlyList<string> RobotFacts { get; } =
    [
        "Hi! I’m R-01, Anindo’s research bot.",
        "CatBoost hit 90.76% on heart disease.",
        "EcoSense was accepted at IEEE ICRPSET-2026.",
        "6,103 maternal-health records, explained with SHAP.",
        "Next stop: Computer Vision & an AI/ML thesis.",
        "Weather forecasts? Ask the Telegram bot: /weather",
    ];

    public IReadOnlyList<PipelineStep> HeartPipeline { get; } =
    [
        new("data", "01", "Datasets", "Public, well-documented clinical data so results can be reproduced.",
            ["UCI Heart Disease: Cleveland, Hungary and Switzerland", "A Kaggle heart-disease dataset", "Binary target: heart disease present or absent"]),
        new("prep", "02", "Preparation", "Cleaning and shaping the data before training.",
            ["[ADD: missing-value handling]", "[ADD: encoding and scaling]", "[ADD: train / test split]"]),
        new("models", "03", "Models", "Four algorithms from three model families, from simple to state of the art.",
            ["Logistic Regression: linear baseline", "Random Forest: bagged tree ensemble", "XGBoost and CatBoost: gradient boosting"]),
        new("eval", "04", "Evaluation", "Models compared on held-out test accuracy.",
            ["CatBoost 90.76% · XGBoost 89.13%", "Logistic Regression and Random Forest 88.59%", "[ADD: further metrics after revision]"]),
    ];

    public string HeartBibTex { get; } =
        "@unpublished{mahmood2026heart,\n" +
        "  title  = {A Comparative Study of Machine Learning\n" +
        "            Algorithms for Early Detection of Heart Disease},\n" +
        "  author = {Mahmood, Anindo and [CO-AUTHORS]},\n" +
        "  note   = {Manuscript under revision},\n" +
        "  year   = {2026}\n" +
        "}";
}
