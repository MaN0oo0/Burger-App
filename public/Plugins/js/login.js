_user = {};
const User = {
  txtemail: "",
  txtpassword: "",
};
let setUser = (name, val) => {
  User[name] = val;
  return User;
};
const validtion = (name, val) => {
  if (name === "txtemail" && !val) {
    $(`#${name}_error`).html("email is required !");
    return false;
  } else {
    $(`#${name}_error`).html("");
  }
  if (name === "txtpassword" && !val) {
    $(`#${name}_error`).html("password is required !");
    return false;
  } else {
    $(`#${name}_error`).html("");
  }

  return true;
};

let InputOnChange = (e) => {
  let { name, value } = e;
  console.log(`Name: ${name} || Value: ${value}`);

  // const email=$("[name='txtemail']").val().trim();
  // const password=$("[name='txtpassword]'").val().trim();
  if (validtion(name, value)) {
    _user = setUser(name, value);
  }
};

OnSubmit = function (e) {
  if (!_user == {}) {
    var newError = {
      txtemail: $("[name='txtemail']").val(),
      txtpassword: $("[name='txtpassword']").val(),
    };
    for (const key in newError) {
      if (validtion(key, newError[key])) {
        _user[key] = newError[key];
      }
    }
    console.log(_user);
  } else {
    const email = $("[name='txtemail']").val();
    const password = $("[name='txtpassword']").val();
    validtion("txtemail", email);
    validtion("txtpassword", password);
  }
};
// $('button[type="submit"]').on("click", function (e) {
//   e.preventDefault();
//   OnSubmit();
// });
