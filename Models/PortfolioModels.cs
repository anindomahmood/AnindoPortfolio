namespace AnindoPortfolio.Models;

// Simple record types: each one describes a piece of portfolio content.

public record ResearchPaper(
    string StatusKey,      // accepted | revision | ongoing  (used by the filter buttons)
    string StatusLabel,
    string Date,
    string Title,
    string Venue,
    string People,
    string Summary,
    string[] Tags,
    string Metric,
    string? DetailSlug);   // null = no detail page yet

public record Project(
    string Area,           // ML | Web | .NET | Graphics (used by the filter buttons)
    string Name,
    string When,
    string Description,
    string[] Stack,
    string RepoUrl);

public record SkillGroup(string Name, string[] Items);

public record TimelineItem(
    string Category,       // edu | cert | work
    string When,
    string Title,
    string Subtitle);

public record ModelResult(
    string Id,
    string Name,
    string Family,
    double Accuracy,
    string Note);

public record FocusArea(
    string Id,
    string Label,
    string Title,
    string Body,
    string Link);

public record PipelineStep(
    string Id,
    string Number,
    string Label,
    string Body,
    string[] Points);

public class HomeViewModel
{
    public required IReadOnlyList<FocusArea> FocusAreas { get; init; }
    public required IReadOnlyList<ResearchPaper> Papers { get; init; }
    public required IReadOnlyList<ModelResult> HeartModels { get; init; }
    public required IReadOnlyList<Project> Projects { get; init; }
    public required IReadOnlyList<SkillGroup> Skills { get; init; }
    public required IReadOnlyList<TimelineItem> Timeline { get; init; }
    public required IReadOnlyList<string> RobotFacts { get; init; }
}

public class ResearchViewModel
{
    public required IReadOnlyList<PipelineStep> Steps { get; init; }
    public required IReadOnlyList<ModelResult> Models { get; init; }
    public required string BibTex { get; init; }
}

public class ErrorViewModel
{
    public string? RequestId { get; set; }
    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
}
