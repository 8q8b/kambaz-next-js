export default function Flex() {
    return (
      <div id="wd-css-flexbox">
        <h2>Flexbox</h2>
  
        <div className="wd-flex-row-container">
          <div className="wd-bg-color-yellow wd-width-75px">
            Fixed width
          </div>
  
          <div className="wd-bg-color-blue wd-fg-color-white wd-flex-grow-1">
            Flex grow 1
          </div>
  
          <div className="wd-bg-color-red wd-flex-grow-1">
            Flex grow 1
          </div>
        </div>
      </div>
    );
  }
  