const URL_ROOT = 'http://localhost:8000/api'
const URL_ROOT_AUTH = 'http://localhost:8000'
// const URL_ROOT = 'https://carmsanc.pythonanywhere.com/api'
// const URL_ROOT_AUTH = 'https://carmsanc.pythonanywhere.com'
const URL_SERVICIOS = {
    url_backend: URL_ROOT_AUTH,
    camposantos : URL_ROOT + '/camposantos/',
    camposanto : URL_ROOT + '/camposanto/',
    difunto : URL_ROOT + '/difunto/',
    difunto_post : URL_ROOT + '/difunto_post/',
    difuntos : URL_ROOT + '/difuntos/',
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
    refreshlogin: URL_ROOT_AUTH +'/api/token/refresh/ ',
    usuarios_camp: URL_ROOT + '/usuarios_camp/',
    obtener_usuarios: URL_ROOT + '/obtener_usuarios/',
    user_permisos_post: URL_ROOT + '/user_permisos_post/',
    listar_permisos_general: URL_ROOT + '/listar_permisos_general/',
    mis_user_permisos: URL_ROOT + '/mis_user_permisos/',
    info_permiso : URL_ROOT + '/permiso/',
}

export default URL_SERVICIOS