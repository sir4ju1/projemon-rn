import base from './base64'
// import lim from 'vso-node-api/interfaces/LocationsInterfaces'
// import ta from 'vso-node-api/TaskAgentApi'
// import ti from 'vso-node-api/interfaces/TaskAgentInterfaces'

const serverUrl = 'https://lolobyte.visualstudio.com/DefaultCollection'
var token = ''
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}
const openIssues = {
  query: `SELECT [System.Id] FROM workitemLinks WHERE([Source].[System.TeamProject] = @project AND [Source].[System.IterationPath] UNDER @currentIteration AND [Source].[System.State] <> 'Removed' AND [Source].[System.State] <> 'Done' AND [Source].[System.State] <> 'Closed') AND ([System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward') AND ([Target].[System.TeamProject] = @project AND [Target].[System.State] <> 'Done' AND [Target].[System.State] <> 'Removed' AND [Target].[System.State] <> 'Closed') MODE (Recursive)`
}
const openIssuesToTestScrum = {
  query: `SELECT [System.Id] from workitemLinks where ([Source].[system.WorkItemType] = 'Product Backlog Item' AND [Source].[System.IterationPath] UNDER @currentIteration AND [Source].[System.State] <> 'Removed' AND [Source].[System.State] <> 'Done' ) AND ([Target].[System.WorkItemType] = 'Task' AND [Target].[System.State] <> 'To Do' AND [Target].[System.State] <> 'In Progress' AND [Target].[System.State] = 'Done') MODE(MustContain)`
}
const openIssuesToTestAgile = {
  query: `SELECT [System.Id] from workitemLinks where ([Source].[system.WorkItemType] = 'User Story' AND [Source].[System.IterationPath] UNDER @currentIteration AND [Source].[System.State] <> 'Removed' AND [Source].[System.State] <> 'Closed' ) AND ([Target].[System.WorkItemType] = 'Task' AND [Target].[System.State] <> 'New' AND [Target].[System.State] <> 'Active' AND [Target].[System.State] = 'Closed') MODE(MustContain)`
}
const api = {}

api.setToken = (token) => {
  headers['Authorization'] = `Basic ${token}`
}
async function getWorkIds(project) {
  try {
    console.log(project)
    let queryResponse = await fetch(`${serverUrl}/${project}/_apis/wit/wiql?api-version=1.0`, { method: 'POST', headers, body: JSON.stringify(openIssues) })
    let queryResult = await queryResponse.json()
    if (!queryResult.workItemRelations || queryResult.workItemRelations.length === 0) {
      return []
    }
    let workIds = queryResult.workItemRelations.map((i) => {
      return i.target.id
    })
   
    return workIds
  } catch (error) {
    console.log(error)
  }
}
api.getProjects = async () => {
  try {
    let response = await fetch(`${serverUrl}/_apis/projects`, { headers })
    let responseJson = await response.json();
    let allItems = []
    for (let i = 0; i < responseJson.count; i++) {
      let item = responseJson.value[i]
      let workIds = await getWorkIds(item.name)
      if (workIds.length > 0) {
        item.workCount = workIds.length
        item.workIds = workIds
        allItems.push(item)
      }      
    }
    return allItems
  } catch (error) {
    console.error(error);
  }
}

api.getProjectWorkIds = getWorkIds

api.getWorkItems = async (workIds) => {
  try {
    let ids = workIds.join(',')
    
    let workResponse = await fetch(`${serverUrl}/_apis/wit/WorkItems?ids=${ids}&fields=System.IterationPath,System.WorkItemType,System.Title,System.State,System.CreatedDate,System.AssignedTo,Microsoft.VSTS.Common.Priority`, { headers })
    let workResult = await workResponse.json()
    return workResult
  } catch (error) {
    console.log(error)
  }
}

api.closeWorkItem = async (id) => {
  try {
    const header = {
      ...headers,
      'Content-Type': 'application/json-patch+json',
    }
    const updateQuery = [
      {
        op: 'replace',
        path: '/fields/System.State',
        value: 'Closed'
      }
    ]
    let response = await fetch(`${serverUrl}/_apis/wit/workitems/${id}?api-version=1.0`, {
      method: 'PATCH',
      headers: header,
      body: JSON.stringify(updateQuery)
    })
    let result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }

}

export default api
