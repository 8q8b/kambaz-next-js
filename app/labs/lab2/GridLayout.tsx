export default function GridLayout() {
    return (
      <div id="wd-css-grid-layout">
        <h2>Grid layout</h2>
  
        {/* HALF PAGE */}
        <div className="wd-grid-row">
          <div className="wd-grid-col-half-page wd-bg-color-yellow">
            Left half
          </div>
          <div className="wd-grid-col-half-page wd-bg-color-blue wd-fg-color-white">
            Right half
          </div>
        </div>
  
        {/* THIRD + TWO THIRDS */}
        <div className="wd-grid-row">
          <div className="wd-grid-col-third-page wd-bg-color-red">
            Left third
          </div>
          <div className="wd-grid-col-two-thirds-page wd-bg-color-green wd-fg-color-white">
            Right two thirds
          </div>
        </div>
  
        {/* SIDEBAR LAYOUT */}
        <div className="wd-grid-row">
          <div className="wd-grid-col-left-sidebar wd-bg-color-yellow">
            Left sidebar
          </div>
  
          <div className="wd-grid-col-main-content wd-bg-color-blue wd-fg-color-white">
            Main content
          </div>
  
          <div className="wd-grid-col-right-sidebar wd-bg-color-red">
            Right sidebar
          </div>
        </div>
      </div>
    );
  }
  