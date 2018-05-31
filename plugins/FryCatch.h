#ifndef FryCatch_H
#define FryCatch_H

#include <napi.h> 
#include <Python.h>

#define FRY_SAFE_RETURN(catcher, value) catcher.safelyExitToJS(value);

class FryCatch {
    public:
        FryCatch(const Napi::Env& env);
        Napi::Value safelyExitToJS(const Napi::Value& value);
    private:
        Napi::Env env;
};

#endif