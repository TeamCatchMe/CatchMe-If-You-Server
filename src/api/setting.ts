// // 여기는 공사중 우선 냅두셔요
// /**
//  *  @route Post user/editnickname
//  *  @desc email duplicate check
//  *  @access Public
//  */
//  router.post("/editnickname", async (req, res) => {
//   try {
//     const userdata = await UserData.find({ email: req.body.email }).count();

//     if (userdata == 0) {
//       console.log("이메일 중복 체크 - 사용 가능한 이메일");
//       return res.status(200).json({
//         status: 200,
//         success: true,
//         message: "사용 가능한 이메일 입니다.",
//         data: {
//           duplicate: "available",
//         },
//       });
//     }

//     console.log("이메일 중복 체크 - 사용중인 이메일");
//     return res.status(200).json({
//       status: 200,
//       success: true,
//       message: "이미 사용중인 이메일입니다.",
//       data: {
//         duplicate: "unavailable",
//       },
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: "서버 내부 오류",
//     });
//   }
// });
