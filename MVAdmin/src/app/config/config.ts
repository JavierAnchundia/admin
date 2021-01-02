// const URL_ROOT = 'http://localhost:8000/api';
// const URL_ROOT_AUTH = 'http://localhost:8000';
const URL_ROOT = 'https://carmsanc.pythonanywhere.com/api';
const URL_ROOT_AUTH = 'https://carmsanc.pythonanywhere.com';

const URL_SERVICIOS = {
  url_backend: URL_ROOT_AUTH,
  camposantos: URL_ROOT + '/camposantos/',
  camposanto: URL_ROOT + '/camposanto/',
  difunto: URL_ROOT + '/difunto/',
  difunto_post: URL_ROOT + '/difunto_post/',
  difuntos: URL_ROOT + '/difuntos/',
  red_social_post: URL_ROOT + '/red_social_post/',
  red_social_put: URL_ROOT + '/red_social_put/',
  red_social: URL_ROOT + '/redes_sociales_camp/',
  sector: URL_ROOT + '/sector_camp/',
  sepultura: URL_ROOT + '/tipo_sepultura_camp/',
  responsable_post: URL_ROOT + '/responsable_difunto_post/',
  responsable_get: URL_ROOT + '/responsable_difunto_get/',
  geolocalizacion_post: URL_ROOT + '/geolocalizacion_post/',
  geolocalizacion_camp: URL_ROOT + '/geolocalizacion_camp/',
  geolocalizacion_del: URL_ROOT + '/geolocalizacion_del/',
  empresas: URL_ROOT + '/empresas/',
  empresa_get: URL_ROOT + '/empresa_get/',
  usuario: URL_ROOT_AUTH + '/users/',
  datosUsuario: URL_ROOT + '/usuario/',
  login: URL_ROOT + '/token/',
  refreshlogin: URL_ROOT_AUTH + '/api/token/refresh/ ',
  usuarios_camp: URL_ROOT + '/usuarios_camp/',
  obtener_usuarios: URL_ROOT + '/obtener_usuarios/',
  user_permisos_post: URL_ROOT + '/user_permisos_post/',
  listar_permisos_general: URL_ROOT + '/listar_permisos_general/',
  mis_user_permisos: URL_ROOT + '/mis_user_permisos/',
  info_permiso: URL_ROOT + '/permiso/',
  recuperar_contrasena: URL_ROOT + '/enviar_email_password_admin/',
  info_permiso_user: URL_ROOT + '/info_permiso_user/',
  paquete_add: URL_ROOT + '/paquete_add/',
  paquete_put_del: URL_ROOT + '/paquete_put_del/',
  paquetes_list: URL_ROOT + '/paquetes_list/',

  notificacion_add: URL_ROOT + '/notificacion_add/',
  notificacion_put_del: URL_ROOT + '/notificacion_put_del/',
  notificacion_list: URL_ROOT + '/notificacion_list/',

  enviarNotificacionPush: URL_ROOT + '/enviarNotificacionPush/',

  homenaje_post: URL_ROOT + '/homenajes_post/',
  himagen_post: URL_ROOT + '/himagen_post/',
  hyoutube_post: URL_ROOT + '/hyoutube_post/',
  homenajesFree: URL_ROOT + '/homenajesFree/',
  homenajesPaid: URL_ROOT + '/homenajesPaid/',
  contactoCamposanto: URL_ROOT + '/contactoCamposanto/',
  contacto: URL_ROOT + '/contacto/',
  homenajeUpd: URL_ROOT + '/homenajeUpd/',
  himagenUpd: URL_ROOT + '/himagenUpd/',
  hyoutubeUpd: URL_ROOT + '/hyoutubeUpd/',

  homenajeDelete: URL_ROOT + '/homenajesDel/',
  del_img: URL_ROOT + '/himagen_del/',
  del_video: URL_ROOT + '/hvideo_del/',
  del_mensaje: URL_ROOT + '/hmensaje_del/',
  del_audio: URL_ROOT + '/haudio_del/',
  del_youtube: URL_ROOT + '/hyoutube_del/',
};

export default URL_SERVICIOS;
