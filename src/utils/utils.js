import * as turf from '@turf/turf';

export const downloadGeojsonFile = (data, fileName) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  const blob = new Blob([data], { type: 'octet/stream' });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const downloadInJOSM = (data, project) => {
  fetch("https://bfokggy4ac.execute-api.us-east-1.amazonaws.com/ds_annotate/", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      crossOrigin: 'anonymous',
    },
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { url, type } = project.properties.imagery;
      const layer_name = project.properties.name.replace(/ /g, '_');
      const url_geojson = `http://localhost:8111/import?url=${data.url.replace("https", "http")}`;
      console.log(url_geojson)
      fetch(url_geojson);
      const url_layer = `​http://localhost:8111/imagery?title=${layer_name}&type=${type}&url=${url}`;
      console.log(url_layer)
      fetch(url_layer);
    });
};

export const getProjectTemplate = (searchParams) => {
  // Set project from Query
  const classes_items = searchParams.get('classes');
  const name = searchParams.get('name');
  const imagery_type = searchParams.get('imagery_type');
  const imagery_url = searchParams.get('imagery_url');
  let project_bbox = searchParams.get('project_bbox');
  let projectFeature = null;
  if (classes_items && name && imagery_type && imagery_url && project_bbox) {
    project_bbox = project_bbox.split(',').map((i) => Number(i));
    projectFeature = turf.bboxPolygon(project_bbox);
    projectFeature.properties.slug = name;
    projectFeature.properties.name = name;
    projectFeature.properties.classes = {};
    classes_items.split('|').forEach((item) => {
      const tuple = item.split(',');
      projectFeature.properties.classes[tuple[0]] = `#${tuple[1]}`;
    });

    projectFeature.properties.imagery = {
      type: imagery_type,
      url: imagery_url,
    };
  }
  return projectFeature;
};