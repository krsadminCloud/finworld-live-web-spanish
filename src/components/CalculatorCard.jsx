import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CalculatorCard({ title, image, link }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: 3,
        overflow: "hidden",
        transition: "transform 0.2s ease",
        "&:hover": { transform: "scale(1.05)" },
      }}
    >
      <CardActionArea onClick={() => navigate(link)}>
        <CardMedia
          component="img"
          src={image}
          alt={title}
          sx={{
            height: 140,
            objectFit: "cover",
          }}
        />
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
