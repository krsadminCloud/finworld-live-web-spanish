import * as React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';

const ArticleCard = ({ title, excerpt, image }) => (
  <Card sx={{ borderRadius: 3, overflow: 'hidden', '&:hover': { transform: 'translateY(-2px)' } }}>
    <CardActionArea>
      <Box sx={{
        position: 'relative',
        pt: '56.25%',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{excerpt}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default function ArticlesGrid() {
  const articles = [
    {
      title: '5 Tips for Building Credit',
      excerpt: 'Improve your score and unlock better financial products.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop'
    },
    {
      title: 'Understanding Investment Risks',
      excerpt: 'A practical framework to assess and manage risks.',
      image: 'https://images.unsplash.com/photo-1581091870622-7b5ae7cdf3d7?q=80&w=1200&auto=format&fit=crop'
    },
    {
      title: 'First-Time Homebuyer Guide',
      excerpt: 'Everything you need to know before you buy.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'
    },
    {
      title: 'Negotiating Your Auto Loan',
      excerpt: 'Strategies to secure the best possible terms.',
      image: 'https://images.unsplash.com/photo-1550552448-9f78575c3b70?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  return (
    <Grid container spacing={3}>
      {articles.map((a, i) => (
        <Grid key={i} item xs={12} sm={6} lg={3}>
          <ArticleCard {...a} />
        </Grid>
      ))}
    </Grid>
  );
}
