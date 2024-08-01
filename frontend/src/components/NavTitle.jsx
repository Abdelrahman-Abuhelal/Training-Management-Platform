import { Box, useTheme, Typography, Breadcrumbs, Link } from '@mui/material';

const NavTitle = ({ title, breadcrumbs }) => {
  const theme = useTheme();

  return (
    <Box sx={{ padding: theme.spacing(2), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
        {title}
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ color: theme.palette.primary.main }}>
        {breadcrumbs.map((breadcrumb, index) =>
          breadcrumb.href ? (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              href={breadcrumb.href}
              sx={{ color: theme.palette.primary.main }}
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <Typography key={index} color="textPrimary">
              {breadcrumb.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default NavTitle;
