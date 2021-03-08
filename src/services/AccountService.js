import { axiosInstance } from "../lib/utilities";

class AccountService {
  async getUser(id) {
    return await axiosInstance({
      url: `users/${id}`,
    }).then((res) => res.data.user);
  }

  async updateUser(data) {
    return await axiosInstance({
      url: `users/${data.id}`,
      method: "POST",
      data,
    }).then((res) => {
      return(res.data.user)
    }).catch(e=>console.log("Error happened while fetching:::",e));
  }
}

export const accountService = new AccountService();
