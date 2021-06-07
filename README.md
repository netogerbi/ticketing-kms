# Microservice Multi-service Architecture | Kubernetes | Docker

This is an example of a real application that is built in microservice architecture and uses kubernetes cluster to run all services.

This application runs in dev mode with [skaffold](https://skaffold.dev/).
It also uses [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/) to route requisitions.
And finally is coded in [Typescript](https://www.typescriptlang.org/) to prevent typos.

To make requests to _Ingress Controller_ the path used in ingress config file is **ticketing.dev**. So the hosts file must be mapped to use localhost as this url.

TIPS:

- the chrome will block the access to url configured in ingress controll. just click anywhere in the browser and type: `thisisunsafe`

#### Useful Commands

```bash
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdasd
```

#### Usefull Links

[ingress-nginx install](https://kubernetes.github.io/ingress-nginx/deploy/#minikube)
[ingress-nginx installation verify](https://kubernetes.github.io/ingress-nginx/deploy/#verify-installation)
