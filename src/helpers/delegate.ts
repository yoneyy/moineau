/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-11-25 23:51:28
 * @Last Modified by: YoneyY (YuTianyuan)
 * @Last Modified time: 2021-11-26 01:31:35
 */

type ProtoType = Record<string, any>;

/**
 * delegates
 * @description
 * Creates a delegator instance used to configure using the `target` on the given `proto` object
 * 创建一个委托实例，用于在给定的 `proto` 对象上使用 `target` 进行配置
 * @param proto
 * The object to be delegated 要委托的对象
 * @param target
 * Delegated object 被委托的对象
 * @returns
 */
function delegates(proto: ProtoType, target: string) {
  return new Delegates(proto, target);
}

/**
 * Delegates
 * 为某个对象设置代理成员
 */
class Delegates {

  private proto: ProtoType;
  private target: string;

  constructor(proto: ProtoType, target: string) {
    this.proto = proto;
    this.target = target;
  }

  /**
   * getter
   * @param name
   * @returns
   */
  getter(name: string) {
    const self = this;
    Object.defineProperty(this.proto, name, {
      get() {
        return this[self.target][name];
      }
    });
    return this;
  }

  /**
   * setter
   * @param name
   * @returns
   */
  setter(name: string) {
    const self = this;
    Object.defineProperty(this.proto, name, {
      set(value) {
        this[self.target][name] = value;
      }
    });
    return this;
  }


  /**
   * access
   * @param name
   * @returns
   */
  access(name: string) {
    return this.getter(name).setter(name);
  }

  /**
   * method
   * @param name
   * @returns
   */
  method(name: string) {
    const proto = this.proto;
    const target = this.target;

    proto[name] = function () {
      return this[target][name].apply(this[target], arguments);
    }

    return this;
  }

}

export default delegates;