using AnindoPortfolio.Services;

var builder = WebApplication.CreateBuilder(args);

// MVC: controllers + Razor views
builder.Services.AddControllersWithViews();

// All portfolio content (papers, projects, skills...) lives in one service
builder.Services.AddSingleton<PortfolioService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();   // serves wwwroot (css, js, CV pdf)

app.UseRouting();
app.UseAuthorization();

// Friendly URL for the research detail page: /research/heart-disease
app.MapControllerRoute(
    name: "research",
    pattern: "research/{slug}",
    defaults: new { controller = "Home", action = "Research" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
