const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {currentYear} Lead Management System. Tous droits réservés.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;