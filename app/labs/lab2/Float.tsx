export default function Float() {
    return (
      <div id="wd-css-float">
        <h2>Float</h2>
  
        <img
          src="/images/react.png"
          width={100}
          className="wd-float-left"
          alt="float-left"
        />
  
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
          Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
          ultricies sed, dolor. Cras elementum ultrices diam.
        </p>
  
        <img
          src="/images/react.png"
          width={100}
          className="wd-float-right"
          alt="float-right"
        />
  
        <p>
          Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue,
          eu vulputate magna eros eu erat. Aliquam erat volutpat.
        </p>
  
        <div className="wd-float-done"></div>
      </div>
    );
  }
  