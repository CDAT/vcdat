#!/bin/bash

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


INSTALLER=`which brew`

NPM_bin=`which npm`
VENV_bin=`which virtualenv`
FSWATCH_bin=`which fswatch`

if [ -z $NPM_bin ]; then
    echo "Installing NPM..."
    brew install npm
    if [ $? -eq 0 ]; then
        echo "Installed NPM."
    else
        echo "Failed to install NPM, exiting."
    	exit 1
    fi
fi

if [ -z $VENV_bin ]; then
    echo "Installing virtualenv..."
    if [ -z `which pip` ]; then
        echo "Couldn\'t find pip, installing pip..."
        sudo easy_install pip
        if [ $? -eq 0 ]; then
            echo "Installed pip, installing virtualenv..."
        else
            echo "Failed to install pip, exiting."
            exit 1
        fi
    fi
    sudo pip --cert $HOME/ca.llnl.gov.pem install virtualenv
    if [ $? -eq 0 ]; then
        echo "Installed virtualenv."
    else
        echo "Failed to install virtualenv, exiting."
        exit 1
    fi
fi

if [ -z $FSWATCH_bin ]; then
    echo "Installing fswatch..."
    brew install fswatch
    if [ $? -eq 0 ]; then
        echo "Installed fswatch"
    else
        echo "Failed to install fswatch, exiting."
        exit 1
    fi
fi

current_dir=`pwd`

if [[ $current_dir == */vcdat* ]]; then
    while [ `basename $current_dir` != "vcdat" ]; do
        current_dir=`dirname $current_dir`
    done
    echo $current_dir
    echo "Installing requirements"
    pushd $current_dir
    cd backend
    virtualenv venv
    source venv/bin/activate
    pip --cert $HOME/ca.llnl.gov.pem install -r requirements.txt
    deactivate
    cd ..
    cd frontend
    npm --cafile=$HOME/ca.llnl.gov.pem install
    echo "Done installing. You should be good to go."
    popd
else
    echo "Can\'t find vcdat directory, not installing app dependencies."
    exit 1
fi
