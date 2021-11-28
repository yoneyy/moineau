/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-11-25 11:47:25
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2021-11-29 01:56:13
 */

import util from 'util';
import type Moineau from '../moineau';

const request: Moineau.Request | Record<string | symbol, any> = {
  /**
   * Return request header
   */
  get header() {
    return this.req.headers;
  },

  /**
   * Set request header
   */
  set header(val) {
    this.req.headers = val;
  },

  /**
   * Return request header, alias as request.header
   */
  get headers() {
    return this.req.headers;
  },

  /**
   * Set request header, alias as request.header
   */
  set headers(val) {
    this.req.headers = val;
  },

  /**
   * Get request URL
   */
  get url() {
    return this.req.url;
  },

  /**
   * Set request URL
   */
  set url(val) {
    this.req.url = val;
  },

  /**
   * Get origin of URL
   */
  get origin() {
    return `${this.protocol}://${this.host}`;
  },

  /**
   * Get full request URL
   */
  get href() {
    if (/^https?:\/\//i.test(this.originalUrl)) return this.originalUrl;
    return this.origin + this.originalUrl;
  },

  /**
   * Get request method
   */
  get method() {
    return this.req.method.toLowerCase();
  },

  /**
   * Set request method
   */
  set method(val) {
    this.req.method = val;
  },

  /**
   * Get request pathname
   */
  get path() {
    return new URL(this.req.url).pathname;
  },

  /**
   * Set request pathname
   */
  set path(val) {
    this.req.url = val;
  },



  inspect() {

  }

};

request[util.inspect.custom] = request.inspect;

export default request;