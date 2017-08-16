#!/bin/bash

CONDA_ENV="nightly"

CERT=$1
if [ "-"$CERT"-" == "-auto-" ]; then
    cat <<EOF > $HOME/ca.llnl.gov.pem
-----BEGIN CERTIFICATE-----
MIIEGTCCA4KgAwIBAgIJAJU8ST3qOQXtMA0GCSqGSIb3DQEBBQUAMIG6MQswCQYD
VQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTESMBAGA1UEBxMJTGl2ZXJtb3Jl
MS8wLQYDVQQKEyZMYXdyZW5jZSBMaXZlcm1vcmUgTmF0aW9uYWwgTGFib3JhdG9y
eTEfMB0GA1UECxMWQ3liZXIgU2VjdXJpdHkgUHJvZ3JhbTEUMBIGA1UEAxMLY2Eu
bGxubC5nb3YxGjAYBgkqhkiG9w0BCQEWC2NhQGxsbmwuZ292MB4XDTEwMDQyMTIy
MjIyMloXDTIwMDQxODIyMjIyMlowgboxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpD
YWxpZm9ybmlhMRIwEAYDVQQHEwlMaXZlcm1vcmUxLzAtBgNVBAoTJkxhd3JlbmNl
IExpdmVybW9yZSBOYXRpb25hbCBMYWJvcmF0b3J5MR8wHQYDVQQLExZDeWJlciBT
ZWN1cml0eSBQcm9ncmFtMRQwEgYDVQQDEwtjYS5sbG5sLmdvdjEaMBgGCSqGSIb3
DQEJARYLY2FAbGxubC5nb3YwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAOeo
aHecyDsZ05LOmSigFL/2WQE3uSDVO/vx2RSI80k/npxRd54m/AmN3/XBoC5/QdwU
cKrFTkZ0a/pZYM91bcda6jRWojeXKZNsRq5G5/T1hGa/yWDnLUfW34Lg4TiXcf07
6QwSmPNP/uRfR5PWRYTotIV0hLl7dUvT+KCykwODAgMBAAGjggEjMIIBHzAdBgNV
HQ4EFgQUceXOa0QeI/jErKhOhgcuetELnZkwge8GA1UdIwSB5zCB5IAUceXOa0Qe
I/jErKhOhgcuetELnZmhgcCkgb0wgboxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpD
YWxpZm9ybmlhMRIwEAYDVQQHEwlMaXZlcm1vcmUxLzAtBgNVBAoTJkxhd3JlbmNl
IExpdmVybW9yZSBOYXRpb25hbCBMYWJvcmF0b3J5MR8wHQYDVQQLExZDeWJlciBT
ZWN1cml0eSBQcm9ncmFtMRQwEgYDVQQDEwtjYS5sbG5sLmdvdjEaMBgGCSqGSIb3
DQEJARYLY2FAbGxubC5nb3aCCQCVPEk96jkF7TAMBgNVHRMEBTADAQH/MA0GCSqG
SIb3DQEBBQUAA4GBAFZN0lmdJ+1eT5aZ1nF92lf5ghECyUf21FjL4JG7EnhVD/mN
x8ZJont1by5j3L3Yjnk76TlJKN9cwGnxU1RhjqbLlm48uYiA/WUkFz7zbYwRHM0B
O9u1qu7Igq8QVmvk778e5rGzfykclPbvNu67n/Sha4RIJLyZUsHcJym+tZSH
-----END CERTIFICATE-----
EOF
CERT=$HOME/ca.llnl.gov.pem
fi

current_dir=`pwd`

if [[ $current_dir == */vcdat* ]]; then
    while [ `basename $current_dir` != "vcdat" ]; do
        current_dir=`dirname $current_dir`
    done
    echo $current_dir
    echo "Installing requirements"
    pushd $current_dir

    # Delete the old one, if it exists.
    conda env remove -y -n ${CONDA_ENV}

    # Create a new one
    conda create -y -n nightly uvcdat -c uvcdat/label/nightly -c conda-forge -c uvcdat --file $current_dir/backend/requirements.txt

    source activate ${CONDA_ENV}
    cd frontend
    echo "prefix=frontend" > $HOME/.npmrc
    if [ -z $CERT ]; then
        npm install
    else
        npm --cafile=$CERT install
    fi
    echo "Done installing. You should be good to go."
    popd
else
    echo "Can\'t find vcdat directory, not installing app dependencies."
    exit 1
fi
