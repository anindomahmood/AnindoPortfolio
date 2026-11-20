# Anindo Mahmood · Research Portfolio (ASP.NET Core MVC)

A dynamic research portfolio built with **ASP.NET Core MVC**, Razor views, plain CSS and vanilla JavaScript (no React, no Tailwind, no npm).

## Features
- Dark / light theme switch in the navbar (your choice is remembered)
- Draggable research robot (R-01) whose eyes follow your cursor, which waves every 7 seconds and shows a new research fact when clicked
- Research focus picker, plus research papers filtered by status
- Interactive heart-disease results chart
- Projects filtered by area, a skills grid, and an education / certifications / workshops timeline
- Research detail page at `/research/heart-disease` with a method stepper, a baseline comparison table and a Copy BibTeX button
- Download CV button (serves `wwwroot/files/Anindo_Mahmood_CV.pdf`)
- Responsive layout with a mobile menu, scroll animations and keyboard support

## Run it in Visual Studio
1. Unzip the folder.
2. Double-click **AnindoPortfolio.sln** (or use *File › Open › Project/Solution*).
3. Press **F5** (or the green ▶ button). Your browser opens at `https://localhost:7080`.
   - The first time, Visual Studio may ask you to trust the HTTPS development certificate. Click **Yes**.

## Run it from the terminal
```bash
cd AnindoPortfolio
dotnet run
```
Then open http://localhost:5080

## .NET version
The project targets **.NET 10** (`net10.0`). If you have a different SDK installed (check with `dotnet --list-sdks`), open `AnindoPortfolio.csproj` and change
```xml
<TargetFramework>net10.0</TargetFramework>
```
to `net9.0` or `net8.0`.

## Where to change things
| What | File |
|---|---|
| Papers, projects, skills, timeline, robot facts | `Services/PortfolioService.cs` |
| Home page layout | `Views/Home/Index.cshtml` |
| Research detail page | `Views/Home/Research.cshtml` |
| Navbar and footer | `Views/Shared/_Layout.cshtml` |
| Colours for both themes | top of `wwwroot/css/site.css` |
| Theme, filters, chart | `wwwroot/js/site.js` |
| Robot behaviour | `wwwroot/js/robot.js` |
| Your CV | replace `wwwroot/files/Anindo_Mahmood_CV.pdf` (keep the same name) |

To add a new paper, add a new `ResearchPaper(...)` line to the `Papers` list in `PortfolioService.cs`. The page and its filter counts update automatically.

## Placeholders to fill
- Research page: data preparation steps, dataset sizes, train/test split, and extra metrics (precision, recall, F1, ROC-AUC)
- BibTeX: co-author names (`[CO-AUTHORS]`)
- WayFinder card: currently links to your GitHub profile; set the real repository URL in `PortfolioService.cs`

## Project structure
```
AnindoPortfolio/
├─ Controllers/HomeController.cs      Index, Research, Error
├─ Models/PortfolioModels.cs          records + view models
├─ Services/PortfolioService.cs       all site content
├─ Views/
│  ├─ Shared/_Layout.cshtml           navbar, theme button, footer
│  ├─ Home/Index.cshtml               home page
│  └─ Home/Research.cshtml            heart-disease study page
├─ wwwroot/
│  ├─ css/site.css
│  ├─ js/site.js · robot.js · research.js
│  └─ files/Anindo_Mahmood_CV.pdf
└─ Program.cs
```
