export default function Kambaz() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <h1 className="display-6 fw-bold mb-2">Welcome to Kambaz</h1>
              <p className="text-secondary mb-4">
                Group Members: Xavier Galanes and Ben Petrillo
              </p>

              <div className="d-grid gap-3">
                <a
                  href="https://github.com/8q8b/kambaz-next-js"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-lg text-start"
                >
                  Link to Front-End Repository
                </a>
                <a
                  href="https://github.com/8q8b/kambaz-node-server-app"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-lg text-start"
                >
                  Link to Back-End Repository
                </a>
                <a href="/account/signin" className="btn btn-danger btn-lg mt-2">
                  Kambaz
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}