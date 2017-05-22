/**
 * Created by isec on 2017/4/20.
 */

export const formatDate = function(value){
  if(!value) return '';
  const date = new Date(value * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const senconds = date.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${senconds}`;
};
