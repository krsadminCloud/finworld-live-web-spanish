import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { articles } from '../data/articles';

const ArticleCard = ({ title, excerpt, image, slug }) => (
  <Card
    sx={{
      borderRadius: 3,
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 12px 28px rgba(15,23,42,0.12)',
      '&:hover': { transform: 'translateY(-3px)' }
    }}
  >
    <CardActionArea
      component={RouterLink}
      to={`/articles/${slug}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}
    >
      <Box sx={{
        position: 'relative',
        pt: '56.25%',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.9,
          px: 2.6,
          pb: 2.6,
          pt: 2.2
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>{excerpt}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default function ArticlesGrid() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))'
        },
        gap: { xs: 2.5, sm: 3 },
        alignItems: 'stretch'
      }}
    >
      {articles.map((a, i) => (
        <Box key={i} sx={{ display: 'flex' }}>
          <ArticleCard {...a} />
        </Box>
      ))}
    </Box>
  );
}
