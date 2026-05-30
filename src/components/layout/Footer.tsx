import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="flex items-center justify-between py-6">
          <p>© 2026 Zlata Portfolio</p>

          <div className="flex gap-4">
            <a href="#">Instagram</a>
            <a href="#">Email</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}