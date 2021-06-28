import React from "react";
export default function EmailForm() {
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
      <form action="" method="post" >
        <label htmlFor="to">to :</label>
        <input type="email" name="to" id="to" />
        <label htmlFor="cc">cc : </label>
        <input type="email" name="cc" id="cc" />
        <label htmlFor="sub">Subject : </label>
        <input type="text" name="sub" id="sub" />
        <label htmlFor="body">Body : </label>
        <input type="text" name="body" id="body" />
        <button
            className="btn waves-effect waves-light "
            //onClick={() => PostData()}
        >
            submit
        </button>
      </form>
      </div>
    </div>
  );
}
