const Project = require("../../models/project.model");

// [GET] /client/search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let newProjects = [];

  if(keyword) {
    const regex = new RegExp(keyword, "i");
    const projects = await Project.find({
      title: regex,
      deleted: false,
      status: "OPEN"
    });
    newProjects = projects;
  }
   res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    projects: newProjects
  });
};
