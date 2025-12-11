import Http from './http'
/*
政策扶持-修改模块基础数据复制接口复制文档复制地址
POST
*/
export const upSupportSummary = (data) => {
  return Http.post('/fg-support-summary/upSupportSummary', data)
}

/*政策扶持-修改措施信息复制接口复制文档复制地址
POST*/
export const upSupportConcrete = (data) => {
  return Http.post('/fg-support-concrete/upSupportConcrete', data)
}

/*
发改局-产业扶持政策-企业列表复制接口复制文档复制地址
POST
*/

export const getSupportEnterpriseList = (data) => {
  return Http.post('/fg-support-enterprise/getSupportEnterpriseList', data)
}

/*

发改局-产业扶持政策复制接口复制文档复制地址
GET
*/

export const getSupportList = () => {
  return Http.get('/fg-support/getSupportList')
}

/*导航栏查询复制接口复制文档复制地址
GET*/
export const getNavigationBar = (data) => {
  return Http.get('/nv-catalogue/getNavigationBarTree')
}

/*查询表单复制接口复制文档复制地址
POST*/

export const getProList = (data) => {
  return Http.post('/nv-storage/getProList', data)
}

/*新增-修改表单复制接口复制文档复制地址
POST
POST*/

export const insertPro = (data) => {
  return Http.post('/nv-storage/insertPro', data)
}

// 发改局-十大计划表
export const getFgTenPlansList = (data) => {
  return Http.post('/fg-ten-plans/getFgTenPlansList', data)
}

// 发改-就业情况
export const getFgEmploySituationList = (data) => {
  return Http.get('/fg-employed-situation/getFgTenPlansList', data)
}

// 发改-产业集群
export const getColonyList = (params) => {
  return Http.get('/fg-colony/getColonyList', params)
}
