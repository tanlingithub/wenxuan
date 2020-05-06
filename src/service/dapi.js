/*
 * DAPI mock接口
 * @author barret
 * @date 2019/05/02
 */
import axios from '@/http'

const dapiHost = 'http://39.98.50.163:3000'
const serviceType = '/spaas-enterprise-contact'
const apiVersion = '/api/v1'
const basicUrl = `${dapiHost}/mock/691/spaas-enterprise-contact/security${apiVersion}`

/**
 * 获取app信息，mock接口
 * @param {*} param0
 */
export const getAppConfig = () =>
  axios.$get(`http://39.100.141.76:3000/mock/95/security/api/v1/configs`)
// export const getAppConfig = () => axios.$get(`${basicUrl}/configs`)
