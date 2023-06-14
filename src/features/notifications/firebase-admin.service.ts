import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'ermessaging',
    private_key_id: '18d4f97d24ab8d43a7c34c726964d3649fab5449',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC0FH2Yh7k1DLhV\nDoYmb3Cj/nHyZ3whkXjU9WWGmj9Ll/6FBWylZKc+pcJHuZhLipgc7TSC2tkgyRN2\n5qLP0aZzMtwfVjDkqNOf6XsOoQn7smKgLnJ5SBmKfGrATk+AmiPQ0OV6SfHKV8Z+\nw2SMgPOqH5ihHue9vYAT5vu4gM6HZDXEg94UI09YnBrA+4peOpgcokZdT4sXQ6c4\ny6lYneAd2IPzHuk2jVtYTEnpIcFFgpKJNvDCOBfK0AMSAU1zQ9uZDmaOUPTnrdqJ\nF0/Vd0SQO7VGgiGNfZ70Fp+2SnXzY3xABq25L94fCVrVUfGXNCLFwpLvQ+wYzZ3t\n7ySx/2HdAgMBAAECggEACMifFQY5wHQDDGhi9BOneOL7sokzAtLSWVYxl46FMS4U\nGhpDobr2dWsnE3yNXdHqzYO8dfgwHcCbvxxM1g+HK5ilfVnPlLevat4RRItnrevr\nkkicXidoJ4XIvIyVUCk0lLDmdeqOwqyOtWGD0V6mLqbP47wFgw8aj4igFUXNzR4U\nlciz5W7cNWsa5ha1mIY3vy7VXLicpSe4pzJbXNjs3JBdmRvARpaYJVKccSiW4wpO\nFHN6qPFTjwgD1C3zmro+EWlSvZRMFoMzZC2P5h+bC3hLSvK4ZSj0InqTlsLIGHn6\nLhkruBHey3riaeZBya9dp5nMz242bYVYWRSNpZbJuQKBgQDbnKx3AF01qTdKURwI\ngK0XGk3KhbliYVapPC9MAb0dKH/xpmcjTVXLrT38155JFSZO7uIupTgGqfkLZlbT\nicCEihiAvSBCRBf/bXxLd2TnxVTjtkiuTqzkdzZKAUPfkCAKUqmN/EMYjyKh2b/I\nOWJz1AZVZoJ+NoBC1zpNZVFO0wKBgQDR6vtOPZH30HFxJh71aDgBq8sfrNL3Zd3K\nqOw+OVSxOISNDmlk4EjoP0GgbVA2Y9aztmVF80BOmowZxUG+kcD+dePJZTVDNG7j\nwNJEufC9m33m0cj1eHljIrLlN18yqcjPubw5bO2A2WPf8n6Xx4sn8/fKHZNQAe02\ne7MTB8X+jwKBgCMdXxo8DatZ3kRcyb22TXbnNs8OKMFJTSEMRYfCs2lpI2QRNmaX\npANINSQrmdyXrCNs4O+SbW3rWa3v9Cwo14aZyiczlmfiGXA3ImuysIi6rcMnT2HH\npK93PFAC+cZSdj0QUJoqXtQbdu8oMRkjy9E3crfPB0iFEGcfoOvlKmYPAoGAPb69\njsUDg34XcC3DW3H9T1iF1dpS75xSAcNwQdlBNSOnsYn0rExghZfdqN+egXEafSAA\nZ/PmDXjeDtJ7xR9AQljQ2LNhWFQ67dkQwFBlJJBxFwzL7JA0PFm/fzarVM6mF5vN\nZqLItWa8PuooHGMAZo8XaqcKZrU6XhVCli1qKrcCgYB4N3XVo20VTDamjtbdToZ/\nHJpHcYAvzYnUFyY6ETuPyKLEyV3RxN3D96m7xG20xFbaAZm4usIDmWNA00ZUwgQc\n26NdylqtIInYn+E63O6ObOLcuoYneZIZ5Dpalp6rFz+Q/JbU0uKsPo3W17QAWRAe\nlQRpyAr8NtBJE8WL7fb38g==\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-ntptg@ermessaging.iam.gserviceaccount.com',
    client_id: '102585122992577165112',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ntptg%40ermessaging.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com'
  } as ServiceAccount)
});

export const firebaseAdmin = admin;
