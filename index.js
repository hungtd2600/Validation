// Đối tương Validator

const Validator = (options) => {
  const selectorRules = {};

  // Ham thuc hien validate
  const validateblur = (inputElement, rule) => {
    let errorMessage;
    // Lay ra cac rule cua selector
    let rules = selectorRules[rule.selector];

    // Lap qua tung rules va kiem tra
    // Neu co loi thi dung viec kiem tra
    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }

    const errorElement = inputElement.parentElement.querySelector(
      options.errorSelector
    );
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }

    return !errorMessage
  };

  const validateonchange = (inputElement) => {
    const errorElement = inputElement.parentElement.querySelector(
      options.errorSelector
    );
    errorElement.innerText = "";
    inputElement.parentElement.classList.remove("invalid");
  };

  // Lay Element cua form can validate
  const formElelment = document.querySelector(options.form);
  if (formElelment) {
    // Lap qua tung rule va validator
    formElelment.onsubmit = (e) => {
      let isFormValid = true
      // Bo su kien submit defaut cua form
      e.preventDefault();
      options.rules.forEach((rule) => {
        const inputElement = formElelment.querySelector(rule.selector);
        let isValid = validateblur(inputElement, rule);
        if(!isValid) {
          isFormValid = false
        }
      });

      if(isFormValid) {
        if(typeof(options.onSubmit === 'function')) {
          var enableInputs = formElelment.querySelectorAll('[name]:not([disabled])')
          let formValues = Array.from(enableInputs).reduce((values, input)=> {
            return (values[input.name] = input.value) && values
          }, {})

          console.log(formValues);
          options.onSubmit(formValues)
        }
      } 
    };

    // Xu li lap qua moi rule va xu li
    options.rules.forEach((rule) => {
      // Luu lai cac rules cho moi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      const inputElement = formElelment.querySelector(rule.selector);
      if (inputElement) {
        // TH blur ra khoi input
        inputElement.onblur = () => {
          validateblur(inputElement, rule);
        };

        // TH khi dang nhap vao input
        inputElement.oninput = () => {
          validateonchange(inputElement);
        };
      }
    });
  }
};

// Định nghĩa các rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Message lỗi
// 2. Khi hợp lệ => Undefined

Validator.isRequired = (selector, message) => {
  return {
    selector: selector,
    test: (value) => {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
      // trim(): loai bo dau cach
    },
  };
};

Validator.isEmail = (selector, message) => {
  return {
    selector: selector,
    test: (value) => {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      // Chuoi test email
      return regex.test(value)
        ? undefined
        : message || "Vui long kiem tra lai email";
    },
  };
};
Validator.minLenght = (selector, min, message) => {
  return {
    selector: selector,
    test: (value) => {
      return value.length >= min
        ? undefined
        : message || `Vui long nhap toi thieu ${min} ki tu`;
    },
  };
};

Validator.isConfirmed = (selector, getConfirmValue, message) => {
  return {
    selector: selector,
    test: (value) => {
      return value === getConfirmValue()
        ? undefined
        : message || "Gia tri nhap vao khong khop";
    },
  };
};
