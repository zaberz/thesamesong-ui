import request from "@/utils/request";

export function getHouse() {
  return request({
    url: "/house/search",
    method: "post"
  });
}

export function addHouse(data) {
  return request({
    url: "/house/add",
    method: "post",
    data: data
  });
}

export function enterHouse(data = { id: "", password: "" }) {
  return request({
    url: "/house/enter",
    method: "post",
    data
  });
}
