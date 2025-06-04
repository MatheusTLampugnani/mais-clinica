import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";

const Layout = () => {
  const navigate = useNavigate();
  const perfil = localStorage.getItem("perfil");
  const nome = localStorage.getItem("nome");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("perfil");
    localStorage.removeItem("nome");
    navigate("/");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Clínica Médica - {nome} ({perfil})
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
      </Container>
    </>
  );
};

export default Layout;