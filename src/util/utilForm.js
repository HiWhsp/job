export default {
  /**
   *  验证表单不会成功提交  
   *  true  =》 有未通过的字段
   * @param {*} arr_col 
   * @param {*} arr_msg 
   * @returns 
   */

  // 引入

  // //需要校验的条件
  // let arr_col = [phone_reg.test(phone), code, pass, pass == pass2];
  // //校验提示
  // let arr_msg = [
  //   "请输入正确的手机号码",
  //   "请输入短信验证码",
  //   "请输入密码",
  //   "两次密码不一致"
  // ];
  // if (utilForm.validateFormFail(arr_col, arr_msg)) {
  //   return;
  // }

  validateFormFail(arr_col, arr_msg) {
    //检测表单有不符合提交的条件   有错误 true   没错误 false
    //是否有 不能提交的条件
    let result = arr_col.some((v, i) => {
      if (!v) {
        alertErr(arr_msg[i]);
      }

      return !v;
    });

    return result;
  },


};
