_user = undefined;
const User = {
  username: "",
  email: "",
  password: "",
};
let setUser = (name, val) => {
  User[name] = val;
  return User;
};
const validtion = (name, val) => {
  if (name === "email" && !val) {
    $(`#${name}_error`).html(`${name} is required !`);
    return false;
  } else {
    $(`#${name}_error`).html("");
  }
  if (name === "password" && !val) {
    $(`#${name}_error`).html(`${name} is required !`);
    return false;
  } else {
    $(`#${name}_error`).html("");
  }
  if (name === "username" && !val) {
    $(`#${name}_error`).html(`${name} is required !`);
    return false;
  } else {
    $(`#${name}_error`).html("");
  }

  return true;
};
let InputOnChange = (e) => {
  let { name, value } = e;
  if (validtion(name, value)) {
    _user = { ...setUser(name, value) };
  }
};

OnSubmit = function (e) {
  if (_user) {
    var newErrorr = {
      txtemail: $("[name='email']").val(),
      txtpassword: $("[name='password']").val(),
      txtusername: $("[name='username']").val(),
    };
    if (
      validtion("email", newErrorr.txtemail) &&
      validtion("password", newErrorr.txtpassword) &&
      validtion("username", newErrorr.txtusername)
    ) {
      console.log("Goood", _user);
      $.post("/register", _user)
        .then((res) => {
          console.log(res.data);
          location.href = "/account?action=login";
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      _user["email"] = newErrorr.txtemail;
      _user["password"] = newErrorr.txtpassword;
      _user["username"] = newErrorr.txtusername;

      console.log("Not Goood", _user);
    }
  } else {
    const email = $("[name='email']").val();
    const password = $("[name='password']").val();
    var newErrorr = {
      email: $("[name='email']").val(),
      password: $("[name='password']").val(),
      username: $("[name='username']").val(),
    };
    for (const key in newErrorr) {
      const element = newErrorr[key];
      validtion(key, element);
    }
  }
};
