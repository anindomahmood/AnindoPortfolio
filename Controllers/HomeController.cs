using System.Diagnostics;
using AnindoPortfolio.Models;
using AnindoPortfolio.Services;
using Microsoft.AspNetCore.Mvc;

namespace AnindoPortfolio.Controllers;

public class HomeController : Controller
{
    private readonly PortfolioService _portfolio;

    // ASP.NET Core gives us the PortfolioService registered in Program.cs
    public HomeController(PortfolioService portfolio)
    {
        _portfolio = portfolio;
    }

    // GET /
    public IActionResult Index()
    {
        var model = new HomeViewModel
        {
            FocusAreas = _portfolio.FocusAreas,
            Papers = _portfolio.Papers,
            HeartModels = _portfolio.HeartModels,
            Projects = _portfolio.Projects,
            Skills = _portfolio.Skills,
            Timeline = _portfolio.Timeline,
            RobotFacts = _portfolio.RobotFacts,
        };
        return View(model);
    }

    // GET /research/heart-disease
    public IActionResult Research(string slug)
    {
        if (slug != "heart-disease")
        {
            return NotFound();
        }

        var model = new ResearchViewModel
        {
            Steps = _portfolio.HeartPipeline,
            Models = _portfolio.HeartModels,
            BibTex = _portfolio.HeartBibTex,
        };
        return View(model);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
