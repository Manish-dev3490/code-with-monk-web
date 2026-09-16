
const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-300 text-base-content p-6">
      <aside>
        <p className="font-semibold text-lg">CodeWithMonk</p>
        <p>
          Code. Connect. Grow.
        </p>
        <p className="text-sm opacity-70">
          © {new Date().getFullYear()} CodeWithMonk. All rights reserved.
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
