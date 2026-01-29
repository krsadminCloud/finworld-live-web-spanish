import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Chip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { articles } from "../data/articles";

const sortedArticles = () => {
  // If featured flag existed we could sort; fallback to original order
  return articles.slice();
};

function ArticleCard({ article }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
        boxShadow: "0 14px 32px rgba(15,23,42,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        {article.category && (
          <Chip
            label={article.category}
            size="small"
            sx={{
              borderRadius: "999px",
              fontWeight: 700,
              height: 26,
              backgroundColor: "rgba(20,184,166,0.12)",
              color: "text.primary",
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        )}
        {article.readTime && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {article.readTime}
          </Typography>
        )}
      </Box>

      <Typography
        component={RouterLink}
        to={`/articles/${article.slug}`}
        variant="h6"
        sx={{
          fontWeight: 800,
          letterSpacing: "-0.012em",
          textDecoration: "none",
          color: "text.primary",
          "&:hover": { color: "primary.main" },
        }}
      >
        {article.title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
        {article.excerpt}
      </Typography>
    </Paper>
  );
}

export default function ArticlesIndex() {
  const list = sortedArticles();

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Helmet>
        <title>FinWorld Guides & Articles | FinWorld</title>
        <meta
          name="description"
          content="Practical personal finance guides on credit, auto loans, and buying a home—plus calculators to help you run the numbers with confidence."
        />
        <link rel="canonical" href="https://www.finworld.live/articles" />
        <meta property="og:title" content="FinWorld Guides & Articles" />
        <meta
          property="og:description"
          content="Practical personal finance guides on credit, auto loans, and buying a home—plus calculators to help you run the numbers with confidence."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.finworld.live/articles" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.finworld.live/" },
              { "@type": "ListItem", position: 2, name: "Articles", item: "https://www.finworld.live/articles" },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: list.map((a, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `https://www.finworld.live/articles/${a.slug}`,
              name: a.title,
            })),
          })}
        </script>
      </Helmet>

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 6, md: 10 } }}>
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
            Guides & Articles
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 820, lineHeight: 1.7 }}>
            Practical, beginner-friendly walkthroughs on credit, auto loans, and buying a home—paired with FinWorld
            calculators so you can check affordability and payments before you commit.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {list.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
