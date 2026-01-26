export default function AssignmentEditor() {
    return (
      <div id="wd-assignments-editor">
        <label htmlFor="wd-name">Assignment Name</label>
        <br />
        <input id="wd-name" defaultValue="A1 - ENV + HTML" />
        <br /><br />
  
        <label htmlFor="wd-description">Description</label>
        <br />
        <textarea
          id="wd-description"
          rows={4}
          cols={50}
          defaultValue="The assignment is available online. Submit a link to the landing page of your application."
        />
        <br /><br />
  
        <table>
          <tbody>
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-points">Points</label>
              </td>
              <td>
                <input id="wd-points" defaultValue={100} />
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-due-date">Due Date</label>
              </td>
              <td>
                <input id="wd-due-date" type="date" defaultValue="2026-02-01" />
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-available-from">Available From</label>
              </td>
              <td>
                <input id="wd-available-from" type="date" defaultValue="2026-01-25" />
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-available-until">Available Until</label>
              </td>
              <td>
                <input id="wd-available-until" type="date" defaultValue="2026-02-10" />
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-published">Published</label>
              </td>
              <td>
                <input id="wd-published" type="checkbox" defaultChecked />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  