import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Stack,
  Button,
  Paper,
  Divider,
  Grid,
  Chip as MuiChip,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { getArticleBySlug } from "../data/articles";

const formatParagraph = (text) => {
  const splitCandidates = [". ", ": "];
  let splitIndex = -1;
  splitCandidates.forEach((sep) => {
    const idx = text.indexOf(sep);
    if (idx > 0 && (splitIndex === -1 || idx < splitIndex)) {
      splitIndex = idx + sep.length;
    }
  });

  if (splitIndex === -1 || splitIndex > 140) {
    return <>{text}</>;
  }

  const lead = text.slice(0, splitIndex).trim();
  const rest = text.slice(splitIndex).trim();

  return (
    <>
      <Box component="span" sx={{ fontWeight: 800 }}>{lead}</Box>
      {rest ? ` ${rest}` : ""}
    </>
  );
};

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Article not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          We couldn’t find that article. Head back to the guides to explore more resources.
        </Typography>
        <Button component={RouterLink} to="/guides" variant="contained">
          View all guides
        </Button>
      </Container>
    );
  }

  const sections = article.sections || [
    { title: article.title, paragraphs: article.body || [] },
  ];

  const slugify = (str = "") =>
    str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const canonical = `https://www.finworld.live/articles/${article.slug}`;

  const sectionAnchors = sections.map((section, idx) => {
    const base = section.title ? slugify(section.title) : `section-${idx}`;
    return base || `section-${idx}`;
  });

  const recommendedTools = [
    { label: "Home Affordability Calculator", to: "/tools/home-affordability", color: "#22c55e" },
    { label: "Mortgage Calculator", to: "/tools/mortgage-calculator", color: "#0ea5e9" },
    { label: "Extra Payment Calculator", to: "/tools/extra-payment", color: "#f97316" },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Helmet>
        <title>{`${article.title} | FinWorld Guides`}</title>
        <meta name="description" content={article.excerpt} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        {article.image && <meta property="og:image" content={article.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        {article.image && <meta name="twitter:image" content={article.image} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            url: canonical,
            image: article.image ? [article.image] : undefined,
            publisher: {
              "@type": "Organization",
              name: "FinWorld",
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.finworld.live/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Articles",
                item: "https://www.finworld.live/guides",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: canonical,
              },
            ],
          })}
        </script>
      </Helmet>

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: 400,
          display: "flex",
          alignItems: "flex-end",
          background:
            "radial-gradient(circle at 18% 20%, rgba(20,184,166,0.14), transparent 46%), #0b1220",
          boxShadow: "0 30px 60px rgba(15,23,42,0.45)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(180deg, rgba(4,7,15,0.28), rgba(4,7,15,0.9)), url(${article.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.95)",
          }}
        />
        <Container sx={{ position: "relative", py: { xs: 5, md: 7 }, maxWidth: "lg" }}>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ color: "rgba(241,245,249,0.82)", mb: 1.5, fontSize: 14 }}
          >
            <Link component={RouterLink} underline="hover" color="inherit" to="/">
              Home
            </Link>
            <Link component={RouterLink} underline="hover" color="inherit" to="/guides">
              Guides
            </Link>
            <Typography color="inherit">{article.title}</Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <Chip
              label={article.category}
              size="small"
              sx={{
                backgroundColor: "rgba(20,184,166,0.16)",
                color: "#a5f3fc",
                border: "1px solid rgba(45,212,191,0.45)",
                fontWeight: 700,
              }}
            />
            <Typography sx={{ color: "rgba(226,232,240,0.9)", fontWeight: 600 }}>
            {article.readTime}
          </Typography>
        </Stack>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            color: "#f8fafc",
            textShadow: "0 12px 30px rgba(0,0,0,0.55)",
            maxWidth: 1000,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
          }}
        >
          {article.title}
        </Typography>
        <Typography
            variant="h6"
          sx={{
            mt: 2,
            maxWidth: 780,
            color: "rgba(241,245,249,0.92)",
            lineHeight: 1.65,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {article.excerpt}
        </Typography>
      </Container>
    </Box>

      <Container
        sx={{
          maxWidth: "lg",
          mt: 0,
          pt: { xs: 6, md: 7 },
          pb: { xs: 6, md: 9 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3.5,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(248,250,252,0.98))",
            boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
          }}
        >
          <Grid
            container
            columnSpacing={{ xs: 0, md: 4 }}
            rowSpacing={{ xs: 3, md: 4 }}
          >
            <Grid item xs={12} md={5}>
              {article.summary && article.summary.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    background:
                      "linear-gradient(180deg, rgba(20,184,166,0.04), rgba(15,23,42,0.015))",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.4, letterSpacing: 0.3 }}>
                    Key points
                  </Typography>
                  <Stack component="ul" spacing={1.1} sx={{ listStyle: "none", pl: 0, m: 0 }}>
                    {article.summary.map((point, idx) => (
                      <Stack
                        key={idx}
                        component="li"
                        direction="row"
                        spacing={1.2}
                        alignItems="center"
                        sx={{ listStyle: "none" }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#14B8A6",
                            boxShadow: "0 0 0 4px rgba(20,184,166,0.16)",
                            flexShrink: 0,
                            ml: 0.5,
                          }}
                        />
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {formatParagraph(point)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px dashed",
                  borderColor: "divider",
                  backgroundColor: "rgba(15,23,42,0.02)",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, letterSpacing: 0.2 }}>
                  At a glance
                </Typography>
                <Stack spacing={1.2}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <Box component="span" sx={{ fontWeight: 800, color: "text.primary" }}>Category:</Box> {article.category}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <Box component="span" sx={{ fontWeight: 800, color: "text.primary" }}>Reading time:</Box> {article.readTime}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  background:
                    "linear-gradient(135deg, rgba(20,184,166,0.05), rgba(14,165,233,0.05))",
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
                    Recommended tools
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} useFlexGap flexWrap="wrap">
                    {recommendedTools.map((tool) => (
                      <Button
                        key={tool.to}
                        component={RouterLink}
                        to={tool.to}
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 999,
                          fontWeight: 700,
                          textTransform: "none",
                          px: 2.4,
                          py: 0.9,
                          bgcolor: tool.color,
                          boxShadow: "0 8px 18px rgba(0,0,0,0.1)",
                          "&:hover": { opacity: 0.9, bgcolor: tool.color },
                        }}
                      >
                        {tool.label}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "rgba(15,23,42,0.02)",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.2 }}>
                  Jump to section
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" rowGap={1}>
                  {sections.map((section, idx) => (
                    <MuiChip
                      key={idx}
                      component="a"
                      href={`#${sectionAnchors[idx]}`}
                      clickable
                      label={section.title || `Section ${idx + 1}`}
                      size="small"
                      sx={{
                        borderRadius: 999,
                        fontWeight: 700,
                        color: "text.primary",
                        borderColor: "divider",
                        textDecoration: "none",
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={4}>
                {sections.map((section, idx) => (
                  <Box key={idx}>
                    {section.title && (
                      <Typography
                        variant="h5"
                        id={sectionAnchors[idx]}
                        sx={{
                          fontWeight: 800,
                          mb: 1.5,
                          letterSpacing: "-0.012em",
                          borderLeft: "3px solid rgba(20,184,166,0.6)",
                          pl: 1,
                        }}
                        >
                          {section.title}
                        </Typography>
                    )}
                    <Stack component="ul" spacing={1.4} sx={{ listStyle: "none", pl: 0, m: 0 }}>
                      {section.paragraphs.map((paragraph, pIdx) => (
                        <Stack
                          key={pIdx}
                          component="li"
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                          sx={{ listStyle: "none" }}
                        >
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              backgroundColor: "rgba(20,184,166,0.9)",
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.7 }}>
                            {typeof paragraph === "string" ? formatParagraph(paragraph) : paragraph}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    {section.ctas && section.ctas.length > 0 && (
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                        {section.ctas.map((cta, cIdx) => (
                          <Button
                            key={cIdx}
                            component={RouterLink}
                            to={cta.to}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 999,
                              fontWeight: 700,
                              textTransform: "none",
                              px: 2,
                              py: 0.6,
                            }}
                          >
                            {cta.label}
                          </Button>
                        ))}
                      </Stack>
                    )}
                    {idx < sections.length - 1 && <Divider sx={{ mt: 3, mb: 2, opacity: 0.35 }} />}
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
