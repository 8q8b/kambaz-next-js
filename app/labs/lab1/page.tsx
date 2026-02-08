export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <h3>HTML Examples</h3>

      <div id="wd-h-tag">
        <h4>Heading Tags</h4>
        Text documents are often broken up into several sections and
        subsections. Each section is usually prefaced with a short
        title or heading that attempts to summarize the topic of the
        section it precedes. There are 6 heading tags: h1 through h6.
      </div>
      <div id="wd-p-tag">
        <h4>Paragraph Tag</h4>

        <p id="wd-p-1">
          This is the first paragraph. The paragraph tag is used to format
          vertical gaps between long pieces of text like this one.
        </p>

        <p id="wd-p-2">
          This is the second paragraph. Even though there is a deliberate white
          gap between paragraphs, browsers ignore whitespace unless told
          otherwise.
        </p>

        <p id="wd-p-3">
          This is the third paragraph. Wrap each paragraph with the paragraph
          tag to preserve spacing.
        </p>
      </div>
      <div id="wd-lists">
        <h4>List Tags</h4>
        <h5>Ordered List Tag</h5>

        How to make pancakes:
        <ol id="wd-pancakes">
          <li>Mix dry ingredients.</li>
          <li>Add wet ingredients.</li>
          <li>Stir to combine.</li>
          <li>Heat a skillet.</li>
          <li>Pour batter.</li>
          <li>Cook until bubbly.</li>
          <li>Flip and cook.</li>
          <li>Serve and enjoy.</li>
        </ol>

        My favorite recipe:
        <ol id="wd-your-favorite-recipe">
          <li>Pour a glass of milk.</li>
          <li>Dunk a cookie into the milk.</li>
          <li>Bite and enjoy.</li>
        </ol>
      </div>
      <h5>Unordered List Tag</h5>

      My favorite books (in no particular order)
      <ul id="wd-my-books">
        <li>Dune</li>
        <li>Lord of the Rings</li>
        <li>Ender's Game</li>
      </ul>

      Your favorite books (in no particular order)
      <ul id="wd-your-books">
        <li>Harry Potter</li>
        <li>Adventure's Of TinTin</li>
        <li>Ranger's Apprentice</li>
      </ul>
      <div id="wd-tables">
        <h4>Table Tag</h4>

        <table border={1} width="100%">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Topic</th>
              <th>Date</th>
              <th>Grade</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Q1</td>
              <td>HTML</td>
              <td>2/3/21</td>
              <td>85</td>
            </tr>
            <tr>
              <td>Q2</td>
              <td>CSS</td>
              <td>2/10/21</td>
              <td>90</td>
            </tr>
            <tr>
              <td>Q3</td>
              <td>JavaScript</td>
              <td>2/17/21</td>
              <td>95</td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={3}>Average</td>
              <td>90</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div id="wd-images">
        <h4>Image tag</h4>

        Loading an image from the internet:<br />
        <img
          id="wd-starship"
          width="400px"
          src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
        />

        <br /><br />

        Loading a local image:<br />
        <img
          id="wd-teslabot"
          src="/images/teslabot.jpeg"
          height="200px"
        />
      </div>
      <div id="wd-forms">
        <h4>Form Elements</h4>

        <form id="wd-text-fields">
          <h5>Text Fields</h5>

          <label htmlFor="wd-username">Username:</label>
          <input id="wd-username" placeholder="jdoe" /><br />

          <label htmlFor="wd-password">Password:</label>
          <input id="wd-password" type="password" defaultValue="123@#$asd" /><br />
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First name"
          />
          <br />
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last name"
          />
          <br />
          <label>Biography:</label><br />
          <textarea id="wd-textarea" cols={30} rows={10}>
            Lorem ipsum dolor sit amet.
          </textarea>

          <h5 id="wd-radio-buttons">Radio buttons</h5>
          <input type="radio" name="genre" /> Comedy<br />
          <input type="radio" name="genre" /> Drama<br />
          <input type="radio" name="genre" value="SciFi" /> SciFi <br />
          <input type="radio" name="genre" value="Fantasy" /> Fantasy <br />


          <h5 id="wd-checkboxes">Checkboxes</h5>
          <input type="checkbox" /> Sci-Fi<br />
          <input type="checkbox" /> Fantasy<br />
          <input type="checkbox" /> Comedy <br />
          <input type="checkbox" /> Drama <br />

          <h4 id="wd-dropdowns">Dropdowns</h4>

          <h5>Select one</h5>
          <label htmlFor="wd-select-one-genre"> Favorite movie genre: </label><br />
          <select id="wd-select-one-genre">
            <option value="COMEDY">Comedy</option>
            <option value="DRAMA">Drama</option>
            <option selected value="SCIFI">
              Science Fiction</option>
            <option value="FANTASY">Fantasy</option>
          </select>

          <h5>Select many</h5>
          <label htmlFor="wd-select-many-genre"> Favorite movie genres: </label><br />
          <select multiple id="wd-select-many-genre">
            <option value="COMEDY" selected> Comedy          </option>
            <option value="DRAMA">           Drama           </option>
            <option value="SCIFI" selected> Science Fiction </option>
            <option value="FANTASY">         Fantasy         </option>
          </select>
        </form>
      </div>
      <h4>Other HTML field types</h4>

      <label htmlFor="wd-text-fields-email"> Email: </label>
      <input type="email"
        placeholder="jdoe@somewhere.com"
        id="wd-text-fields-email" /><br />

      <label htmlFor="wd-text-fields-salary-start"> Starting salary:</label>
      <input type="number"
        defaultValue="100000"
        placeholder="1000"
        id="wd-text-fields-salary-start" /><br />

      <label htmlFor="wd-text-fields-rating"> Rating: </label>
      <input type="range"
        defaultValue="4"
        max="5"
        placeholder="Doe"
        id="wd-text-fields-rating" /><br />

      <label htmlFor="wd-text-fields-dob"> Date of birth: </label>
      <input type="date"
        defaultValue="2000-01-21"
        id="wd-text-fields-dob" /><br />
      <h4>Anchor tag</h4>

      Please{" "}
      <a href="https://www.lipsum.com" id="wd-lipsum">
        click here
      </a>{" "}
      to get dummy text
      <br />

      <a href="https://github.com/8q8b/kambaz-next-js" id="wd-github">
        My GitHub
      </a>

    </div>
  );
}
