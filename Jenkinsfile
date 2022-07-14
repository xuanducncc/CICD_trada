pipeline {
    agent any
    stages {
    //     stage('Jenkins send notify to Slack') {
    //        steps {
    //            slackSend (
    //                channel: "devops-notifier",
    //                color: '#FFFF00',
    //                message: "Starting Job:    » ${env.JOB_NAME} [${env.BUILD_NUMBER}]\nBranch     » ${env.GIT_BRANCH}",
    //                teamDomain: 'nalsdn',
    //                token: 'cAcTbALGTKmY5dj1LVEszzCE'
    //            )
    //            script {
    //                env.GIT_TAG = sh(returnStdout: true, script: 'git tag --points-at ${GIT_COMMIT} || :').trim()
    //                env.GIT_COMMIT_MSG = sh(script: 'git log -1 --pretty=%B ${GIT_COMMIT}', returnStdout: true).trim()
    //            }
    //        }
    //    }
        stage('Stage echo'){
            steps {
                echo 'Begin Start Jenkine File for task CI/CD'
            }
        }
        stage('Deploy dev environment') {
            steps {
                sh 'ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook -i playbooks/inventories/dev/hosts playbooks/playbook.yaml'
            }
        }
    }
//    post {
//        success {
//            slackSend (
//                channel: "devops-notifier",
//                color: '#00FF00',
//                message: "Status   » SUCCESS\nJob       » ${env.JOB_NAME} [${env.BUILD_NUMBER}]\nBranch     » ${env.GIT_BRANCH}\n    » ${env.GIT_COMMIT} [${GIT_COMMIT_MSG}]",
//                teamDomain: 'nalsdn',
//                token: 'cAcTbALGTKmY5dj1LVEszzCE'
//            )
//            // bitbucketStatusNotify(buildState: 'SUCCESSFUL')
//        }
//        failure {
//            slackSend (
//                channel: "devops-notifier",
//                color: '#FF0000',
//                message: "Status   » FAILED\nJob       » ${env.JOB_NAME} [${env.BUILD_NUMBER}]\nBranch     » ${env.GIT_BRANCH}\n    » ${env.GIT_COMMIT} [${GIT_COMMIT_MSG}]",
//                teamDomain: 'nalsdn',
//                token: 'cAcTbALGTKmY5dj1LVEszzCE'
//            )
//            // bitbucketStatusNotify(buildState: 'FAILED')
//        }
//    }
}

